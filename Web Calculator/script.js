document.addEventListener("DOMContentLoaded", function loading (){

    /* const btn01 = document.querySelector("button#btn01") 
    const btn02 = document.querySelector("button#btn02") 
    const btn03 = document.querySelector("button#btn03") 
    const btn04 = document.querySelector("button#btn04") 
    const btn05 = document.querySelector("button#btn05") 
    const btn06 = document.querySelector("button#btn06") 
    const btn07 = document.querySelector("button#btn07") 
    const btn08 = document.querySelector("button#btn08") 
    const btn09 = document.querySelector("button#btn09") 
    const btnSoma = document.querySelector("button#btnSoma") 
    const btnSub = document.querySelector("button#btnSub") 
    const btnMulti = document.querySelector("button#btnMulti") 
    const btnDiv = document.querySelector("button#btnDiv") 
    const btnPorce= document.querySelector("button#btnPorce") 

    console.log("Botões selecionados:", btn01, btn02, btn03, btn04, btn05, btn06, btn07, btn08, btn09, btnSoma, btnSub, btnMulti, btnDiv, btnPorce);
    */

    const calcArea = this.querySelector("input#calcArea")
    const calculatorBox = this.querySelector("div#CalculatorBox")

    calculatorBox.addEventListener("click", function(event){
        if (event.target.tagName === 'BUTTON') {

            const btnID = event.target.id
            console.log(`Clicou no botão ${btnID}`)

            const btnSelect = document.getElementById(`${btnID}`)
            console.log("Selecionado: " + btnSelect)

            btnSelect.classList.add('afundar');
            setTimeout(function(){
                btnSelect.classList.remove('afundar');
            }, 150)

            if (btnID == "btnDel") {
                calcArea.value = calcArea.value.slice(0, -1)
            }
            else if (btnID == "btnPorce") {
                calcArea.value += "%"
            }
            else if (btnID == "btnDiv") {
                calcArea.value += "/"
            }
            else if (btnID == "btnMulti") {
                calcArea.value += "*"
            }
            else if (btnID == "btnSub") {
                calcArea.value += "-"
            }
            else if (btnID == "btnSoma") {
                calcArea.value += "+"
            }
            else if (btnID == "btnSend") {
                try {

                    const input = document.querySelector("input#calcArea").value
                    const resultado = eval(input)
                    document.querySelector("p#pResult").innerHTML = `O resultado é: <span id="numSpan">${resultado}</span>`
                    calcArea.value = ""

                }
                catch (error) {
                    document.querySelector("p#pResult").innerText = "Erro na expressão"
                }
                
            }
            else {
                calcArea.value += Number(btnSelect.value)
            }

        }
    })

})