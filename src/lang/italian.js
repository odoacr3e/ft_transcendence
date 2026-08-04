export const italian = {
    messages: {
        common: {
            search: "Cerca",
            players: "Giocatori",
            tournament: "Torneo | Tornei",
            accept: "Accetta",
            reject: "Rifiuta",
            pending: "In attesa...",
            friend: "Amico | Amici",
            win: "Vittoria | Vittorie",
            lose: "Sconfitta | Sconfitte",
            draw: "Patta | Patte",
            game: "Partita | Partite",
            by: "da",
            or: "o | oppure"
        },
        header: {
            inv: {
                creation: "Creato il {date} @:common.by",
                desc: "Sei stato invitato al @.lower:common.tournament <b>{tourName}</b> creato @:common.by {tourCreator}.<br>Vuoi partecipare?",
                expired: "Invito scaduto",
                friendTitle: "Richiesta di amicizia",
                tourTitle: "Invito ad un torneo",
                friendNotif : "{sender} ti ha inviato una richiesta di amicizia",
                tourNotif: "{sender} ti ha invitato a partecipare al @.lower:common.tournament {tour}"
            },
            zeroNotif: "Nessuna notifica",
            profile: "Profilo",
            settings: "Impostazioni",
            logout: "Logout",
            login: "Accedi"
        },
        menu: {
            userList: "{nUser} utenti trovati per \"<b>{search}</b>\"",
            online: "Gioca online",
            offline: "Gioca offline",
            lBoard: "Classifica",
            codex: "Codex"
        },
        login: {
            val: {
                name: "Nome",
                surname: "Cognome",
                nationality: "Nazionalità",
                theme: "Tema"
            },
            OTP: {
                auth: "Autenticazione OTP",
                desc: "Inserisci le il codice che ti è stato mandato via email.",
                exp: "Scadrà in {date}",
                on: "Attivato",
                off: "Disattivato"
            },
            err: {
                title: "Credenziali errate",
                wrong: "Username o password sbagliate.",
                tooMany: 'Fatti troppi tentativi.',
                clone: "Esiste gia' un utente\ncon queste credenziali",
				username: "Lo username deve avere\nalmeno 4 caratteri",
				email: "Controlla di aver\ninserito un email valida",
				password: "La password deve avere:\n\
							- almeno 8 caratteri\n- un numero\n\
							- una maiuscola\n- una minuscola\n\
							- un carattere speciale ($,%,#...)"
            },
            welcome: "Benvenuto!",
            wellback: "Ben tornato!",
            signIn: "Registrati",
            forgot: "Password dimenticata?",
            loginAcc: "@:header.login col tuo account",
            missingAcc: "Non hai ancora un account?",
            google: "Continua con Google"
        },
        leaderBoard: {
            title: "Top 10 @.lower:common.players",
            outOf: "su {games}",
        },
        tournaments: {
            newTour: "Crea un nuovo @.lower:{'common.tournament'}!",
            placeholder: "Nome del @.lower:common.tournament",
            creator: "Creatore del @.lower:{'common.tournament'}:",
            button: "Crea",
            ongoing: "In corso...",
            closed: "Conclusi",
            noTour: "Nessun @.lower:common.tournament"
        },
        userPage: {
            edit: {
                infoU: "Informazioni utente",
                changeAvatar: "Cambia avatar",
                removeAvatar: "Elimina avatar",
                changePwd: "Cambia password",
                newPwd: "Nuova password",
                saveChanges: "Salva le modifiche",
                desc: "La password deve avere almeno 8 caratteri, un numero, una maiuscola, una minuscola e un carattere speciale ($,%,#...)"
            },
            friendList: "Lista di amici",
            removeFriend: "Elimina amicizia",
            friendRequest: "Richieste d'amicizia",
            pendingRequest: "Nessuna richiesta in attesa",
            matchHistory: "Cronologia delle partite",
            sendRequest: "Manda amicizia"
        }
    }
}