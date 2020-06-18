const https = require('https')
const readline = require('readline')
const inquirer = require('inquirer')

let responseString;
let response;
let responseArray;

sentimenAnalys();

function sentimenAnalys(){
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    })

    rl.question('Tuliskan Apa Yang Ingin Kamu Analisa ? ', answer => {

        // jawaban akan di conver ke json array
        const answerText = JSON.stringify({
            text: answer
        })

        // Api Handler
        let options = {
            host: 'apidemo.theysay.io',
            path: '/api/v1/sentiment',
            method: 'POST',

            headers : {
                Referer: 'https://apidemo.theysay.io/',
                'Content-Type': 'application/json'
            }
        };

        // Fungsi Request Data Dari Api
        let req = https.request(options, function(res) {
            responseString = ""
            
            // Datajawaba Akan Di Push Ke Element responseString
            res.on('data', function(data){
                responseString += data
            })
            
            // Fungsi dimana data akan di proses dengan pilihan POSTIVE DAN NEGATIVE
            res.on('end', function(){
                
                response = responseString

                responseArray = JSON.parse(response)

                console.log(`\nI Process Analisa Text: ` + `"` + answer + `"\n`)
                console.log(
                    'Your Text is: ' + 
                    responseArray.sentiment.label + 
                    ' (I AM ' +
                    Math.round(responseArray.sentiment.confidence * 100) +
                    '% confident.)'
                )

                if(responseArray.sentiment.label == 'POSITIVE'){
                    console.log('Selamat Saya Suka Dengan Anda Postive')
                } else if(responseArray.sentiment.label == 'NEGATIVE') {
                    console.log('Upsss sepertinya kamu sedang tidak POSTIVE')
                }

                console.log(
                    '\nI am ' +
                      Math.round(responseArray.sentiment.confidence * 100) +
                      '% confident.'
                );
                repeatFunc();
            })
        })

        req.write(answerText);
        req.end();
        rl.close();

        // Fungsi Dimana Jika Users Ingin Kembali Menjawab Pertanyaan
        function repeatFunc(){
            inquirer
                .prompt([
                    {
                        type: 'list',
                        name: 'answer',
                        message: 'Apakah Kamu Ingin Mengulang Lagi Pertanyaan Nya ??',
                        choices: ['Iya', 'Tidak']
                    }
                ])
                .then(answers => {
                    console.log('Answer : ', answers.answer)
                    if(answers.answer == 'Iya'){
                        sentimenAnalys()
                    } else if(answers.answer == 'Tidak'){
                        console.clear()
                        console.log('Selamat Tinggal')
                        process.exit()
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        }
    })
}