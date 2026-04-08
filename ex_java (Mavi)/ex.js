let Guards = [], Prisoners = [], Folders = [];

////////////////////// CLASSI //////////////////////

class Person
{
    constructor ()
    {
        let full_name = prompt("Nome e cognome:\n");
        let birthday = prompt("Nato il (dd/mm/yyyy):\n");
        let born_in = prompt("Nato in (Citta'-Stato):\n");
        if (typeof(full_name) != "string" ||
            typeof(birthday)  != "string" ||
            typeof(born_in)   != "string") { throw "Valore inserito incorrettamente, riprovare." }
        this.Full_name = full_name; 
        this.Birthday = birthday;
        this.Born_in = born_in;
    }
}

class Info
{
    constructor (full_name, id)
    {
        if (full_name === undefined && id === undefined)
        {
            full_name = prompt("Nome e cognome:\n");
            if (typeof(full_name) != "string") { throw "Valore inserito incorrettamente, riprovare." }
    
            let temp = Prisoners.find(x => x.Full_name === full_name);
            if (temp == undefined) { throw "Prigioniero non ancora registrato." }
            this.Id = temp.Id;
            this.Full_name = temp.Full_name;
        }
        else
        {
            this.Id = id;
            this.Full_name = full_name;
        }

        let date_in = prompt("Data di incarceramento (dd/mm/yyyy):\n");
        let date_out = prompt("Data di uscita (dd/mm/yyyy):\n");
        let crime = prompt("Crimine:\n");
        if (typeof(date_in)  != "string"  ||
            typeof(date_out) != "string"  ||
            typeof(crime)    != "string") { throw "Valore inserito incorrettamente, riprovare." }
        this.Date_in = date_in;
        this.Date_out = date_out;
        this.Crime = crime;   
        this.Alive = true;
        this.Escaped = false;
    }
}

class Prisoner extends Person
{
    constructor()
    {
        super();
        let n = Math.random();
        while (Prisoners.length > 0 && !Prisoners.every(Pri => Pri.Id !== n)) { n = Math.random(); }
        this.Id = n;

        // let s = prompt("Vuoi aggiungere un fasciolo su questo Prigioniero? (si/no)");
        // if (s === "si")
        // {
        //     let i;
        //     try { i = new Info(this.Full_name, this.Id); }
        //     catch (error) { throw error; }
        //     Folders.push(i);
        // }
    }
}

////////////////////// ADDER //////////////////////



/**
 * @param {Prisoner} p
 */
function AddNewPrisoner()
{
    let p;
    try { p = new Prisoner(); }
    catch (error) { alert(error); return; }
    Prisoners.push(p);
}

/**
 * @param {Person} g
 */
function AddNewGuard()
{
    let g;
    try { g = new Person(); }
    catch (error) { alert(error); return; }
    Guards.push(g);
}

/**
 * @param {Info} i
 */
function AddNewInfo()
{
    let i;
    try { i = new Info(); }
    catch (error) { alert(error); return; }
    Folders.push(i);
}

////////////////////// MODIFIER //////////////////////

function SearchFor(name)
{
    if (typeof(name) != "string") { throw "Valore inserito incorrettamente, riprovare."; }
    let found = Folders.find(folder => folder.Full_name === name);
    if (found == undefined) { throw "Nome non trovato."; }
    return found;
}

/**
 * @param {Info} p
 */
function PrisonerEscaped(name)
{
    if (typeof(name) != "string") { alert("Valore inserito incorrettamente, riprovare."); return ; }
    let p;
    try { p = SearchFor(name); }
    catch (error) { alert(error); return; }
    p.Escaped = true;
}

/**
 * @param {Info} p
 */
function PrisonerDead(name)
{
    if (typeof(name) != "string") { alert("Valore inserito incorrettamente, riprovare."); return ; }
    let p;
    try { p = SearchFor(name); }
    catch (error) { alert(error); return; }
    p.Alive = false;
}

////////////////////// SHOW //////////////////////

function renderPrisoners(array)
{
    return `
        <h3>Prigionieri</h3>
        <dl>
            ${array.map(item => `
                <dt>${item.Full_name ?? "Senza nome"}</dt>
                <dd>
                    ID: ${item.Id ?? "N/D"} | Birthday: ${item.Birthday ?? "N/D"} | Born in: ${item.Born_in ?? "N/D"}
                    <hr>
                </dd>
            `).join("")}
        </dl>
    `;
}

function renderGuards(array)
{
    return `
        <h3>Guardie</h3>
        <dl>
            ${array.map(item => `
                <dt>${item.Full_name ?? "Senza nome"}</dt>
                <dd>
                    Birthday: ${item.Birthday ?? "N/D"} | Born in: ${item.Born_in ?? "N/D"}
                    <hr>
                </dd>
            `).join("")}
        </dl>
    `;
}

function renderFolders(array)
{
    return `
        <h3>Fascicoli</h3>
        <dl>
            ${array.map(item => `
                <dt>${item.Full_name ?? "Senza nome"}</dt>
                <dd>
                    ID: ${item.Id ?? "N/D"} | Date in: ${item.Date_in ?? "N/D"} | Date out: ${item.Date_out ?? "N/D"} \
                    | Crime: ${item.Crime ?? "N/D"} ${item.Escaped ? "| Escaped" : ""} ${item.Alive ? "" : "| Dead"}
                    <hr>
                </dd>
            `).join("")}
        </dl>
    `;
}

function Show() {
    const s = prompt("Selezionare l'array desiderato (G => Guardie/P => Prigionieri/F => Fascicoli):\n");
    if (typeof s !== "string") { alert("Valore inserito incorrettamente, riprovare."); return ; }

    if (s == "g") { document.getElementById("g").innerHTML = renderGuards(Guards); }
    else if (s == "p") { document.getElementById("p").innerHTML = renderPrisoners(Prisoners); }
    else if (s == "f") { document.getElementById("f").innerHTML =  renderFolders(Folders); }
    else output.innerHTML = "Scelta non valida.";
}