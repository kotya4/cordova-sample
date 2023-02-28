let MUST_BE_INFINITE = magic(0xffff)
let IS_DEPLOY = false
let NOTE3_DIM = [ 360, 615 ]
let USE_NOTE3_DIM = true
let ENTITY_START_KEY = 'Start'
let ENTITY_GOBLET_KEY = 'Kubok'
let ENTITY_BACKPACK_KEY = 'Ryukzak'
let TREASURES_SCALE_IMAGE = 0.015
let ENTITIES_SCALE_IMAGE = 0.1
let USE_MAGIC_SCALE_16X16 = false
let USE_LEGACY_SPRITES = false

// Game Entry
async function gangway(data={})
{
    let pole_background_color = '#ffca56'
    let pole_block_blue = '#1e60d1'
    let pole_block_white = '#ffffff'
    let logo_colors = [ '#1d61d0', '#6b88aa', '#a8a68f' ].reverse()

    let version = cordova_version()

    body().innerHTML = ""
    body().style.height = '100vh'
    body().style.margin = body().style.padding = 0
    body().style.overflow = 'hidden'

    let rct = body().getBoundingClientRect()
    // debugging(version)(rct, { as: 'client rect' })

    let cvs = element('canvas')
    if(USE_NOTE3_DIM)
    {
        cvs.w = cvs.width = NOTE3_DIM[0]
        cvs.h = cvs.height = NOTE3_DIM[1]
    }
    else
    {
        cvs.w = cvs.width = rct.width
        cvs.h = cvs.height = rct.height
    }
    cvs.style.position = 'absolute'
    cvs.style.left = cvs.style.top = 0
    cvs.style.width = cvs.style.height = '100%'
    cvs.style.imageRendering = 'pixelated'
    body().append(cvs)

    version = 'w:' + rct.width + `(${ cvs.w })` + ' h:' + rct.height + `(${ cvs.h })` + ' cordova:' + version

    let ctx = cvs.getContext('2d')
    ctx.imageSmoothingEnabled = false
    ctx.fillStyle = pole_background_color
    ctx.fillRect(0, 0, cvs.w, cvs.h)

    //////////////////////////////////////////////////////////////////////////
    // Calculating text measurements in pixels for text written in size 1em //
    //////////////////////////////////////////////////////////////////////////

    let fontface = new FontFace("dpcomic", 'url(resources/dpcomic/dpcomic.ttf)')
    await fontface.load()
    document.fonts.add(fontface)
    ctx.font = '12px dpcomic'
    ctx.fillText(version, 0, cvs.h)
    let meas = ctx_measure_font(ctx, version)
    ctx.fillStyle = magic('blue')
    ctx.fillText(version, 0, cvs.h)
    // debugging(meas, { as: 'measurement' })

    /////////////////////////////////////////////////////
    // Finding out pole rectangle (need for draw logo) //
    /////////////////////////////////////////////////////

    let s;
    s = magic(0)
    let bfx = meas.w * s // block offset
    let bfy = meas.h * s
    s = magic(4)
    let wfx = meas.w * s // window offset
    let wfy = meas.h * s
    let cols = 5
    let rows = 8
    let bs = (cvs.w - wfx * 2 - bfx * (cols - 1)) / cols // block size
    let pm = magic(2) // pole margin
    let px = wfx - pm
    let py = wfy - pm
    let pw = cols * bs + (cols - 1) * bfx + 2 * pm // pole width with margin
    let ph = rows * bs + (rows - 1) * bfy + 2 * pm

    //////////////////
    // Drawing logo //
    //////////////////

    ctx.fillStyle = 'white'
    //ctx_fill_text_center(ctx, 'загрузка', meas, )
    let logo = 'gangway'
    let logo_h = wfy * 1.0 // actually must be wfy * magic(0.75, { must_be: a => a < 1.0 })
    ctx.font = logo_h + 'px dpcomic'
    let logo_w = ctx.measureText(logo).width
    let logo_x = cvs.w / 2 - logo_w / 2
    let logo_y = cvs.h / 2
    let logo_oy = logo_h * magic(0.55) // actually must be 0 but
    let logo_dx = logo_h * magic(0.07)
    let logo_dy = logo_h * magic(0.07)

    logo_colors.forEach((color, i) => {
        ctx.fillStyle = color
        ctx.fillText(logo, logo_x - logo_dx * i, logo_y - logo_dy * i)
    })
    await new Promise(r => setTimeout(r, magic(2000)))

    ////////////////////////////////
    // Loading external resources //
    ////////////////////////////////

    let treasures = null
    let entities = null
    let audio = null
    if(USE_LEGACY_SPRITES)
    {
        let ims = {
            ...await resources_S13__Match3__Pixelart(),
            ...await resources_unknown(),
            ...await resourses_sound__tap(),
        }
        treasures = ims_treasures_S13__Match3__Pixelart(ims)
        entities = ims_entities_unknown(ims)
        audio = ims_parse_audio(ims)
    }
    else
    {
        let ims = {
            ...await resources_unknown2(),
            ...await resourses_sound__tap(),
        }
        treasures = ims_treasures_unknown2(ims)
        entities = ims_entities_unknown2(ims)
        audio = ims_parse_audio(ims)
    }
    debugging({ treasures, entities, audio }, { as: "LOAD INFO", console_only: true })

    ////////////////////
    // Preparing pole //
    ////////////////////

    ctx.fillStyle = pole_block_blue
    //await ctx_fill_rect_bottom_2_top(ctx, px, py, pw, ph, magic(500), magic(20, { must_be: a => a < ph }))
    let global_delay = magic(1000)
    let step = magic(20, { must_be: a => a < ph })
    let delay = global_delay / ph * step
    for(let cph=step; cph<ph; cph+=step)
    {
        ctx.fillStyle = pole_background_color
        ctx.fillRect(0,0,cvs.w,cvs.h)
        ctx.fillStyle = pole_block_blue
        ctx.fillRect(px, py+(ph-cph), pw, cph)
        logo_colors.forEach((color, i) => {
            ctx.fillStyle = color
            ctx.fillText(logo, logo_x - logo_dx * i, Math.min(py+(ph-cph)-logo_oy, logo_y) - logo_dy * i)
        })
        await timeout(delay)
    }
    ctx.fillStyle = pole_block_blue
    ctx.fillRect(px, py, pw, ph)

    //////////////////
    // Filling pole //
    //////////////////

    for(let y=0; y<rows; ++y)
    {
        for(let x=0; x<cols; ++x)
        {
            let bx = wfx + (bs + bfx) * x
            let by = wfy + (bs + bfy) * y
            ctx.fillStyle = (y + x) & 1 ? pole_block_blue : pole_block_white
            ctx.fillRect(bx, by, bs, bs)
            await timeout(magic(10))
        }
    }
    await timeout(magic(500))

    let map = Array(cols * rows).fill(null).map(() => ({}))
    let startgoblet_is = pick_from([[0, map.length - 1], [cols - 1, (rows - 1) * cols]])
    if(random(0, 1) > 0.5) // swap
        [startgoblet_is[0], startgoblet_is[1]] = [startgoblet_is[1], startgoblet_is[0]]
    startgoblet_is = [(rows - 1) * cols, cols - 1] // ignore pick
    let starti = startgoblet_is[0]
    let gobleti = startgoblet_is[1]
    map[starti] = { tr: entities[ENTITY_START_KEY] }
    map[gobleti] = { tr: entities[ENTITY_GOBLET_KEY] }
    let dencity = 0.8
    let scale;
    let scale_master = 1 / magic(60) * bs
    if(!USE_MAGIC_SCALE_16X16)
        // Using custom scale_master because of new tileset
        scale_master = TREASURES_SCALE_IMAGE
    scale = magic(2) * scale_master
    let delays = magic([ 0, 500, 1000 ])
    let proms = []
    let i = -1
    for(let y=0; y<rows; ++y)
    {
        for(let x=0; x<cols; ++x)
        {
            ++i
            let bx = wfx + (bs + bfx) * x
            let by = wfy + (bs + bfy) * y
            let bw = bs
            let bh = bs
            map[i].rct = [ bx, by, bw, bh ]
            if(map[i].tr != null)
                continue
            if(random(0, 1) > dencity)
                continue
            let tr = pick_from(treasures)
            map[i].tr = tr
            let tra = tr[0]
            let trb = tr[1]
            let tw = tra.width * scale
            let th = tra.height * scale
            let tx = bx + bw / 2 - tw / 2
            let ty = by + bh / 2 - th / 2
            map[i].tr_rct = [ tx, ty, tw ,th ]
            proms.push(timeout(pick_from(delays)).then(() => {
                ctx.drawImage(tra, tx, ty, tw, th)
            }))
        }
    }
    await Promise.all(proms)
    await timeout(magic(500))

    if(!USE_MAGIC_SCALE_16X16)
        scale_master = ENTITIES_SCALE_IMAGE
    scale = magic(0.5) * scale_master
    let startim = map[starti].tr
    let stw = startim.width * scale
    let sth = startim.height * scale
    let startpos = apply_to(i_2_xy(starti, cols),
        [ hadamard_product, [(bs + bfx), (bs + bfy)] ],
        [ hadamard_sum, [ wfx+bs/2-stw/2, wfy+bs/2-sth/2 ] ])
    let gobletim = map[gobleti].tr
    let gow = gobletim.width * scale
    let goh = gobletim.height * scale
    let gobletpos = apply_to(i_2_xy(gobleti, cols),
        [ hadamard_product, [(bs + bfx), (bs + bfy)] ],
        [ hadamard_sum, [ wfx+bs/2-gow/2, wfy+bs/2-goh/2 ] ])
    // debugging({ startim })
    ctx.drawImage(startim, ...startpos, stw, sth)
    ctx.drawImage(gobletim, ...gobletpos, gow, goh)
    // debugging({ starti, gobleti, startpos, gobletpos })
    await timeout(magic(500))

    if(!USE_MAGIC_SCALE_16X16)
        scale_master = ENTITIES_SCALE_IMAGE
    scale = magic(0.75) * scale_master
    let backpackim = entities[ENTITY_BACKPACK_KEY]
    let baw = backpackim.width * scale
    let bah = backpackim.height * scale
    let bctx = cvs_create_layer(cvs, 'bp')
    bctx.drawImage(cvs, 0,0)
    let bpdx = 2
    let pbdelay = 10
    let bpmaxx = cvs.w - baw
    for(let x = cvs.w + baw; x > bpmaxx; x -= bpdx)
    {
        ctx.drawImage(bctx.cvs,0,0)
        ctx.drawImage(backpackim, x, py + ph - magic(bah / 3), baw, bah)
        await timeout(pbdelay)
    }

    ////////////
    // Logics //
    ////////////

    function onclick({ clientX: mx, clientY: my })
    {
        mx = mx / rct.width * cvs.w
        my = my / rct.height * cvs.h
        // ctx.fillStyle = 'red';ctx.fillRect(mx,my,10,10)

        let map_i = null
        for(let i=0; i<map.length; ++i)
        {
            let [x, y, w, h] = map[i].rct
            if( x <= mx && mx <= x+w && y <= my && my <= y+h )
            {
                map_i = i
                break
            }
        }
        if(map_i != null)
        {
            let tr = map[map_i].tr
            let rct = map[map_i].tr_rct
            if(tr && rct)
            {
                ctx.drawImage(tr[1], ...rct)
                audio.play('tap')
            }
        }
    }
    addEventListener('click', onclick)

    //////////////////////////////////////////
    // developer questioning at debug state //
    //////////////////////////////////////////

    if(IS_DEPLOY)
    {
        DEVEL_QUESTION_SHOW = false
    }
    if(DEVEL_QUESTION_SHOW)
    {
        let t1 = setTimeout(() => {
            debugging(DEVEL_QUESTION_CONTENT_STRINGIFYABLE)
        }, DEVEL_QUESTION_DELAY_BEFORE_SHOW)
        let t2 = setTimeout(() => {
            removeEventListener('click', onclick)
            DEVEL_QUESTION_SHOW = false
            USE_MAGIC_SCALE_16X16 = true
            USE_LEGACY_SPRITES = true
            ENTITY_START_KEY = 'start'
            ENTITY_GOBLET_KEY = 'goblet'
            ENTITY_BACKPACK_KEY = 'backpack'
            clearTimeout(t1)
            clearTimeout(t2)
            gangway()
        }, DEVEL_QUESTION_DELAY_BEFORE_RELOAD)
    }
}

let __cvs_create_layer = {}
function cvs_create_layer(parent, name='_lastest')
{
    if(name in __cvs_create_layer)
        return __cvs_create_layer[name]
    let cvs = element('canvas', { from: parent })
    let ctx = cvs.getContext('2d')
    ctx.cvs = cvs
    cvs.ctx = ctx
    cvs.h = cvs.height
    cvs.w = cvs.width
    ctx.h = cvs.h
    ctx.w = cvs.w
    ctx.clearRect(0,0,ctx.w,ctx.h)
    __cvs_create_layer[name] = ctx
    return ctx
}

async function resourses_sound__tap()
{
    let root = './resources/'
    let path = 'sound-tap'
    let arr = `
        566685__windwalk-entertainment__tap-on-shoulder.wav
        `
        .replace(/[ \t]+/g, '')
        .split('\n')
        .filter(e => e)
    let im = null
    let prom = arr
        .map(e => new Promise(r => {
            let filepath = root + path + '/' + e
            im = new Audio(filepath)
            im.addEventListener('canplaythrough', (...a) => {
                return r()
            })
            im.addEventListener('error', e =>
                debug('audio load err at ' + filepath)(e)
            )
        }))
    let oo = {}
    await Promise.all(prom)
    oo['sound__tap'] = im
    return oo
}

function ims_parse_audio(ims)
{
    let o = {
        play(key){ return this.sources[key].play() },
        sources: {},
    }
    let ss = filter_by_regex(ims, /^sound__/)
    Object.keys(ss).map(key => {
        let prettykey = key.slice('sound__'.length)
        o.sources[prettykey] = ss[key]
    })
    return o
}

function apply_to(value, ...fas)
{
    fas.forEach(([func, ...args]) => {
        value = func(value, ...args)
    })
    return value
}

function i_2_xy(i, cols)
{
    return [
        i % cols | 0,
        i / cols | 0,
    ]
}

function hadamard_product(a, b)
{
    let c = []
    for(let i = 0; i < a.length || i < b.length; ++i)
    {
        c.push(a[i] * b[i])
    }
    return c
}

function hadamard_sum(a, b)
{
    let c = []
    for(let i = 0; i < a.length || i < b.length; ++i)
    {
        c.push(a[i] + b[i])
    }
    return c
}

function random(a, b)
{
    return a + Math.random() * (b - a)
}

let __debugging_count_call = {}
function debugging_count_call(key)
{
    if(IS_DEPLOY)
        return
    let a = __debugging_count_call
    if(key in a)
    {
        ++a[key].call_counter
    }
    else
    {
        a[key] = { call_counter: 0 }
    }
    debugging(a[key].call_counter, { as: key + ' call count' })
}

function pick_from(a)
{
    // debugging_count_call('pick_from function')
    if(a instanceof Array)
        return a[a.length * Math.random() | 0]
    if(typeof a == 'object')
        return a[pick_from(Object.keys(a))]
    throw error('Cannot pick from value')
}

function ims_entities_unknown(ims)
{
    let all = ims['unknown']
    return all
}

function ims_treasures_S13__Match3__Pixelart(ims)
{
    let all = ims['S13 Match3 Pixelart']
    let t = {}
    Object.keys(all).forEach(key => {
        let realkey = key
        if(key[0] == '0')
        {
            let index = 0
            if(key[key.length - 1] == 'b')
            {
                index = 1
                key = key.slice(0,-1)
            }
            if(!(key in t))
            {
                t[key] = [null, null]
            }
            t[key][index] = all[realkey]
        }
    })
    return t
}

function zip(a, b)
{
    let c=[]
    for(let i=0; i<a.length || i<b.length; ++i)
    {
        c.push([a[i], b[i]])
    }
    return c
}

async function ctx_fill_rect_bottom_2_top(ctx, px, py, pw, ph, global_delay, step)
{
    let delay = global_delay / ph * step
    for(let cph=step; cph<ph; cph+=step)
    {
        ctx.fillRect(px, py+(ph-cph), pw, cph)
        await timeout(delay)
    }
    ctx.fillRect(px, py, pw, ph)
}

function timeout(delay)
{
    return new Promise(r => setTimeout(r, delay))
}

function hex_2_rgb(str_or_int)
{
    if(typeof str_or_int == 'string')
    {
        if(str_or_int[0] == '#')
        {
            str_or_int = str_or_int.slice(1)
        }
        if(str_or_int.slice(0,2) != '0x')
        {
            str_or_int = '0x' + str_or_int
        }
    }
    let a = parseInt(str_or_int)
    let b = (a >> 0x00) & 0xff
    let g = (a >> 0x08) & 0xff
    let r = (a >> 0x10) & 0xff
    return [ r, g, b ]
}

function ctx_fill_text_center(ctx, text, meas)
{
    let { chr_w: w_per_chr, chr_h: h_per_chr, mar_w } = meas_text(meas, text, ctx.canvas.w)
    ctx.font = h_per_chr + 'px monospace'
    ctx.fillText(text, mar_w, ctx.canvas.h / 2 - h_per_chr / 2)
}

function meas_text(meas, text, max_width, margin_chrs = 1)
{
    let w_per_chr = max_width / ( text.length + margin_chrs * 2 )
    let h_per_chr = meas.h / meas.w * w_per_chr
    return {
        chr_w: w_per_chr,
        chr_h: h_per_chr,
        mar_w: margin_chrs * w_per_chr,
    }
}

async function ctx_fadeout(ctx, data={})
{
    let iters = 3
    let delay_per_iter = 100
    let rgb = [ 0, 0, 0 ]
    if('rgb' in data)
    {
        rgb = data.rgb
    }
    ctx.fillStyle = 'rgba(' + rgb + ', 0.5)'
    for(let i=0; i<iters; ++i)
    {
        ctx.fillRect(0, 0, ctx.canvas.w, ctx.canvas.h)
        await new Promise(r => setTimeout(r, delay_per_iter))
    }
    ctx.fillStyle = 'rgba(' + rgb + ', 1.0)'
    ctx.fillRect(0, 0, ctx.canvas.w, ctx.canvas.h)
    await new Promise(r => setTimeout(r, delay_per_iter))
}

function ctx_measure_font(ctx, sample_text)
{
    let metrics = ctx.measureText(sample_text)
    let actualHeight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
    return {
        w: metrics.width / sample_text.length,
        h: actualHeight,
    }
}

function filter_by_regex(o, re)
{
    let oo = {}
    Object.keys(o).filter(key => re.test(key)).forEach(key => oo[key] = o[key])
    return oo
}

function filter_by_key(o, keys)
{
    // tip: u cannot check if string in array as like int in array ie `1 in [1, 2, 3]` -> true but
    //      but `"1" in [ "1", "2", "3" ]` -> false. use Array.includes(String) instead.
    let oo = {}
    Object.keys(o).filter(key => keys.includes(key)).forEach(key => oo[key] = o[key])
    return oo
}

function im_invert(im)
{
    // Creates new canvas with inverted values of image
    let cvs = element('canvas')
    cvs.width = im.width
    cvs.height = im.height
    let ctx = cvs.getContext('2d')
    ctx.clearRect(0,0,cvs.width,cvs.height)
    ctx.filter = 'invert(1)'
    ctx.drawImage(im, 0,0)
    return cvs
}

function ims_treasures_unknown2(ims)
{
    let a = ims['unknown2']
    let b = filter_by_key(a, [
        'Mech',
        'Monetka',
        'Rupy',
        'Serdtse',
        'Sunduk',
        'Zelye',
        'Zolotoy_Rupiy',
        'Zvezda',
    ])
    let c = {}
    Object.keys(b).forEach(key => c[key] = [b[key], im_invert(b[key])])
    return c
}

function ims_entities_unknown2(ims)
{
    return filter_by_key(ims['unknown2'], [
        'Kubok',
        'Ryukzak',
        'Start',
    ])
}

async function resources_unknown2()
{
    let root = './resources/'
    let path = 'unknown2'
    let arr = `
        Kubok.png
        Mech.png
        Monetka.png
        Rupy.png
        Ryukzak.png
        Serdtse.png
        Start.png
        Sunduk.png
        Zelye.png
        Zolotoy_Rupiy.png
        Zvezda.png
        `
        .replace(/[ \t]+/g, '')
        .split('\n')
        .filter(e => e)
    let o = {}
    let prom = arr
        .map(e => new Promise(r => {
            let im = new Image()
            im.src = root + path + '/' + e
            o[e.slice(0, e.lastIndexOf('.'))] = im
            im.onload = r
        }))
    let oo = {}
    await Promise.all(prom)
    oo[path] = o
    return oo
}

async function resources_unknown()
{
    let root = './resources/'
    let path = 'unknown'
    let arr = `
        start.png
        goblet.png
        backpack.png
        `
        .replace(/[ \t]+/g, '')
        .split('\n')
        .filter(e => e)
    let o = {}
    let prom = arr
        .map(e => new Promise(r => {
            let im = new Image()
            im.src = root + path + '/' + e
            o[e.slice(0, e.lastIndexOf('.'))] = im
            im.onload = r
        }))
    let oo = {}
    await Promise.all(prom)
    oo[path] = o
    return oo
}

async function resources_S13__Match3__Pixelart()
{
    let root = './resources/'
    let path = 'S13 Match3 Pixelart'
    let arr = `
        01b.png
        01.png
        02b.png
        02.png
        03b.png
        03.png
        04b.png
        04.png
        05b.png
        05.png
        06b.png
        06.png
        07b.png
        07.png
        btn01b.png
        btn01.png
        tileset.png
        `
        .replace(/[ \t]+/g, '')
        .split('\n')
        .filter(e => e)
    let o = {}
    let prom = arr
        .map(e => new Promise(r => {
            let im = new Image()
            im.src = root + path + '/' + e
            o[e.slice(0, e.lastIndexOf('.'))] = im
            im.onload = r
        }))
    let oo = {}
    await Promise.all(prom)
    oo[path] = o
    return oo
}

function error(a)
{
    debugging(a)
    return a
}

function magic(a, data={})
{
    if('must_be' in data)
    {
        if(!data.must_be(a))
        {
            throw error('Magic value ' + a + ' not satisfying')
        }
    }
    return a
}

function cordova_version()
{
    if(typeof cordova == 'object' && 'platformId' in cordova && 'version' in cordova)
    {
        return cordova.platformId + '@' + cordova.version
    }
    return 'no-cordova'
}

function element(a, data={})
{
    if('id' in data)
    {
        return document.querySelector('#'+data.id)
    }
    if('from' in data)
    {
        let clone = data.from.cloneNode(true)
        clone.removeAttribute('id')
        return clone
    }
    return document.createElement(a)
}

function body()
{
    return document.body
}

function debugging(a, data={})
{
    console.log('DEBUGGING', a, { data })
    if('console_only' in data && data.console_only)
        return debugging
    if(IS_DEPLOY)
    {
        return debugging
    }
    let delay = 'delay' in data ? data.delay : magic(50000)
    let wrapper_id = magic('debugging')
    let wrapper = element('div', { id: wrapper_id })
    if(!wrapper)
    {
        wrapper = element('div')
        wrapper.id = wrapper_id
        wrapper.style.zIndex = MUST_BE_INFINITE
        wrapper.style.position = 'absolute'
        wrapper.style.left = '1em'
        wrapper.style.top = 0
        wrapper.style.opacity = 0
        wrapper.style.transition = 'opacity 0.5s'
        body().append(wrapper)
    }
    let text = element('pre')
    text.style.background = 'rgba(50,50,50,0.75)'
    text.style.color = 'white'
    text.style.marginBottom = '1em'
    text.style.padding = '1em'
    let val = stringify(a)
    if('as' in data)
    {
        val = val + ' as ' + data.as
    }
    text.innerText = val
    wrapper.prepend(text)
    wrapper.style.opacity = 1
    setTimeout(() => {
        wrapper.style.opacity = 0
        text.style.display = 'none'
    }, delay)
    return debugging
}

function stringify(a)
{
    /*
    if(a instanceof Array)
    {
        return ('[\n' + a.map(a => stringify(a))).replace(/,/g, ',\n') + ']\n'
    }
    */
    if(typeof a == 'object')
    {
        let pref = ''
        if(a == null)
        {
        }
        else if('constructor' in a)
        {
            pref = '<' + a.constructor.name + '>'
        }
        return pref + JSON.stringify(a, null, 4)
    }
    return String(a)
}