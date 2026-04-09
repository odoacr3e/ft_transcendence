let Guards = [], Prisoners = [], Folders = [];

const p_form = document.getElementById("prisonerForm");
const g_form = document.getElementById("guardForm");
const f_form = document.getElementById("folderForm");
const d_form = document.getElementById("deadForm");
const e_form = document.getElementById("escapedForm");

////////////////////// CLASSI //////////////////////

class Person
{
    constructor (full_name, birthday, born_in)
    {
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
    constructor (full_name, id, date_in, date_out, crime)
    {
        if (typeof(full_name) != "string"  ||
            typeof(id)        != "string"  ||
            typeof(date_in)   != "string"  ||
            typeof(date_out)  != "string"  ||
            typeof(crime)     != "string") { throw "Valore inserito incorrettamente, riprovare." }

        let temp = Prisoners.find(x => x.Full_name === full_name);
        if (temp == undefined) { throw "Prigioniero non ancora registrato." }

        this.Id = id;
        this.Full_name = full_name;
        this.Date_in = date_in;
        this.Date_out = date_out;
        this.Crime = crime;   
        this.Alive = true;
        this.Escaped = false;
    }
}

class Prisoner extends Person
{
    constructor(full_name, birthday, born_in)
    {
        super(full_name, birthday, born_in);
        let n = Math.random();
        while (Prisoners.length > 0 && !Prisoners.every(Pri => Pri.Id !== n)) { n = Math.random(); }
        this.Id = n;
    }
}

//////////////////////FORMS//////////////////////

/**
 * @param {Prisoner} p
 */
p_form.addEventListener("submit", function (event)
{
    event.preventDefault();
    const fullName = document.getElementById("full_namep").value;
    const birthday = document.getElementById("birthdayp").value;
    const bornIn = document.getElementById("born_inp").value;

    let p;
    try { p = new Prisoner(fullName, birthday, bornIn); }
    catch (error) { alert(error); return; }

    Prisoners.push(p);

    document.getElementById("demop").innerHTML = "Prigioniero aggiunto: " + p.Full_name;
    refreshList();
});

/**
 * @param {Person} g
 */
g_form.addEventListener("submit", function (event)
{
    event.preventDefault();
    const fullName = document.getElementById("full_nameg").value;
    const birthday = document.getElementById("birthdayg").value;
    const bornIn = document.getElementById("born_ing").value;

    let g;
    try { g = new Person(fullName, birthday, bornIn); }
    catch (error) { alert(error); return; }

    Guards.push(g);

    document.getElementById("demog").innerHTML = "Guardia aggiunto: " + g.Full_name;
    refreshList();
});

/**
 * @param {Info} f
 */
f_form.addEventListener("submit", function (event)
{
    event.preventDefault();
    const fullName = document.getElementById("full_namef").value;
    const id = document.getElementById("id").value;
    const dateIn = document.getElementById("date_in").value;
    const dateOut = document.getElementById("date_out").value;
    const crime = document.getElementById("crime").value;

    let f;
    try { f = new Info(fullName, id, dateIn, dateOut, crime); }
    catch (error) { alert(error); return; }

    Folders.push(f);

    document.getElementById("demof").innerHTML = "Fascicolo aggiunto: " + f.Full_name;
    refreshList();
});

/**
 * @param {Info} p
 */
d_form.addEventListener("submit", function (event)
{
    event.preventDefault();
    const fullName = document.getElementById("full_named").value;

    let p;
    try { p = SearchFor(fullName); }
    catch (error) { document.getElementById("demod").innerHTML = "Prigioniero " + fullName + " inesistente."; return; }
    p.Alive = false;

    document.getElementById("demod").innerHTML = "Dato aggiornato.";
    refreshList();
});

/**
 * @param {Info} p
 */
e_form.addEventListener("submit", function (event)
{
    event.preventDefault();
    const fullName = document.getElementById("full_namee").value;

    let p;
    try { p = SearchFor(fullName); }
    catch (error) { document.getElementById("demod").innerHTML = "Prigioniero " + fullName + " inesistente."; return; }
    p.Escaped = true;

    document.getElementById("demoe").innerHTML = "Dato aggiornato.";
    refreshList();
});

////////////////////// MODIFIER //////////////////////

function SearchFor(name)
{
    if (typeof(name) != "string") { throw "Valore inserito incorrettamente, riprovare."; }
    let found = Folders.find(folder => folder.Full_name === name);
    if (found == undefined) { throw "Nome non trovato."; }
    return found;
}

////////////////////// SHOW //////////////////////

function renderPrisoners()
{
    return `
        <h3>Prigionieri</h3>
        <dl>
            ${Prisoners.map(item => `
                <dt>${item.Full_name ?? "Senza nome"}</dt>
                <dd>
                    ID: ${item.Id ?? "N/D"} | Birthday: ${item.Birthday ?? "N/D"} | Born in: ${item.Born_in ?? "N/D"}
                    <hr>
                </dd>
            `).join("")}
        </dl>
    `;
}

function renderGuards()
{
    return `
        <h3>Guardie</h3>
        <dl>
            ${Guards.map(item => `
                <dt>${item.Full_name ?? "Senza nome"}</dt>
                <dd>
                    Birthday: ${item.Birthday ?? "N/D"} | Born in: ${item.Born_in ?? "N/D"}
                    <hr>
                </dd>
            `).join("")}
        </dl>
    `;
}

function renderFolders()
{
    return `
        <h3>Fascicoli</h3>
        <dl>
            ${Folders.map(item => `
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

function refreshList()
{
    if (Guards.length > 0) { document.getElementById("g").innerHTML = renderGuards(); }
    if (Prisoners.length > 0) { document.getElementById("p").innerHTML = renderPrisoners(); }
    if (Folders.length > 0) { document.getElementById("f").innerHTML =  renderFolders(); }
}