const words = document.getElementById('words')
//to make div focusable

var charsCnt = 0
var wordCnt = 0

var text
var code
var avgWLen = 0
var charSpans

var crctLtrCnt = 0
var incrtCnt = 0
var starTime = -1
var intervalID = -1
var isFinished = false
var maxWords = 0;

resetAll()

// Keyboard addEventListener
// document.addEventListener("keydown", (event) => {

document.getElementById('typeArea').addEventListener("keydown", (event) => {
    console.debug('"' + event.key + '"', event.code)
    if (isFinished)
        return
    if (event.key.length == 1 && charsCnt < text.length) {
        if (starTime == -1) {
            // intervalID = setInterval(update, 1000)
            starTime = new Date().getTime()
        }
        // console.debug(event.key)
        charSpans[charsCnt].classList.remove('active')
        if (charsCnt < text.length - 1)
            charSpans[charsCnt + 1].classList.add('active')
        if (charSpans[charsCnt].innerText === event.key) {
            charSpans[charsCnt].className = 'correct'
            crctLtrCnt++
        } else if (event.code == 'Space' && charSpans[charsCnt].innerText == '_') {
            charSpans[charsCnt].className = 'correct'
            crctLtrCnt++
        } else {
            charSpans[charsCnt].className = 'incorrect'
            incrtCnt++
        }
        charsCnt++
    } else if (event.key === 'Backspace' && charsCnt > 0) {
        if (charSpans[charsCnt - 1].classList.contains('correct'))
            crctLtrCnt--

        charSpans[charsCnt].className = ''

        charSpans[--charsCnt].className = 'active'

    }
    if (charsCnt == text.length)
        finished()
    console.debug(crctLtrCnt)
}
);

document.getElementById("btn_apply").addEventListener('click', (e) => {
    resetAll()
})

function resetAll() {

    numbers = document.getElementById("num").checked
    puctuations = document.getElementById("punc").checked
    maxWords = Number(document.getElementById("maxWords").value)
    lower = document.getElementById("lower").checked

    charsCnt = 0
    wordCnt = 0

    text = format(lower, maxWords, puctuations, numbers)
    code = setup(text)
    wtext = text.split(' ')

    //finding average word length
    avgWLen = 0
    for (itxt of wtext)
        avgWLen += itxt.length

    // making the avgWLen value to atleast 5
    avgWLen = Math.max(Math.round(avgWLen / wtext.length), 4)

    words.innerHTML = code
    charSpans = words.getElementsByTagName('letter')

    crctLtrCnt = 0
    incrtCnt = 0
    starTime = -1
    intervalID = -1
    isFinished = false
    charSpans[charsCnt].classList.add('active')
    document.getElementById('matrics').style.visibility = ''
}

function format(lower, words, puctuations, nums) {
    txt = ""
    // sample space for generating random text
    const chars = "zxcvbnmasdfghjklqwertyuiopQWERTYUIOPASDFGHJKLZXCVBNM"
    const cNums = "0123456789"
    const specChars = "<>?,./;'[]\\`-=~!@#$%^&*()_+{}|:\""

    for (let i = 0; i < words + 10; i++) {
        // creating letters in words
        for (let j = 0; j < (3 + Math.floor(Math.random() * 4)); j++) {
            if (i % 3 == 0)
                txt += cNums.charAt(Math.random() * cNums.length);
            else
                txt += chars.charAt(Math.random() * chars.length);
        }
        if (i % 5 == 0)
            txt += specChars.charAt(Math.random() * specChars.length) + " "
        else
            txt += " "
    }

    if (lower)
        txt = txt.toLowerCase()
    if (!puctuations)
        txt = txt.replaceAll(/[~!@#$%^&*()_\+`\-=\{\}\|\[\]\\:";'<>\?,\.\/]/g, '')
    if (!nums)
        txt = txt.replaceAll(/[0-9]/g, '')

    txt = txt.split(' ')
    out = []
    for (tx of txt)
        if (tx.length > 0)
            out.push(tx)

    out = out.slice(0, words)
    return out.join(" ")
}

function setup(text) {
    sep = text.split(' ')
    htmlCode = ''
    i = 0
    for (word of sep) {
        htmlCode += `<span class='word'>`
        for (l of word)
            htmlCode += `<letter>${l}</letter>`
        if (i++ < sep.length - 1) {
            htmlCode += `<letter type="space">_</letter></span>`
            continue
        }
        htmlCode += '<letter></letter></span>'
    }

    return htmlCode
}

function finished() {
    isFinished = true
    const now = new Date().getTime()
    console.debug('finished', `time: ${now - starTime}`)
    clearInterval(intervalID)
    update()
}

function update() {
    if (starTime == -1 || charsCnt < avgWLen)
        return

    if (document.getElementById('matrics').style.visibility == '')
        document.getElementById('matrics').style.visibility = 'visible'

    const now = new Date().getTime()

    wpm = Math.round(60000 / (avgWLen * (now - starTime) / (crctLtrCnt - maxWords)))
    rwpm = Math.round(60000 / (avgWLen * (now - starTime) / (charsCnt - maxWords)))
    cpm = Math.round(60000 / ((now - starTime) / crctLtrCnt))
    rcpm = Math.round(60000 / ((now - starTime) / charsCnt))
    accuracy = (100 * crctLtrCnt / (charsCnt + incrtCnt)).toFixed(2)

    console.debug('wpm:' + wpm, 'cpm:' + cpm)
    document.getElementById('wpm').innerText = wpm
    document.getElementById('rwpm').innerText = rwpm
    document.getElementById('cpm').innerText = cpm
    document.getElementById('rcpm').innerText = rcpm
    document.getElementById('accuracy').innerText = accuracy + '%'
}
