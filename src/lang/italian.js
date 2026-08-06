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
        },
        codex: {
            king: {
                name:   "Il Sovrano",
                quote:  "'Bianco o Nero' mi chiedono. Ho di meglio da fare.",
                lore:   "Figli del vecchio Re Rosso, i gemelli Bianco e Nero hanno vissuto una vita agiata, senza le frivole preoccupazioni dei semplici.\
	                    Dopo che il Re Rosso morì per la puntura di un'ape, non vennero lasciate chiare indicazioni per un erede e\
	                    i due si catapultarono in battibecchi degni dei bambini più viziati.\
	                    Il principe Bianco, non contento di essersi coperto di ridicolo fino ad allora, decise di muovere guerra contro suo fratello Nero.\
	                    Che tipo di Re si ritroverà il regno è una domanda a cui non tutti troveranno risposta, \
	                    la cosa certa è che faranno di tutto pur di non permettere all'altro di vincere questa disputa.",
                move:   "Il Re si può muovere di una casella in ogni direzione fin tanto che non si trova sotto tiro dei nemici.",
                ability: {
                    name:   "Ultimo a cadere",
                    desc:   "\"Che tipo di re sarai?\" è una domanda a cui sei portato a rispondere, \
	                        e ciò ti infonderà una forza micidiale nel momento in cui rimarrai da solo nel campo di battaglia.",
                    cost:   "0"
                }
            },
            champ: {
                name:   "Il Campione",
                quote:  "...",
                lore:   "I Campioni non sono solo valorosi guerrieri scelti dal Re come scorta, ma sono dei veri e propri simboli di forza.\
	                    Alti, veloci, letali e decisamente di poche parole, ogni cavaliere che si rispetti ha questo titolo come ambizione e spesso\
	                    giostrano e combattono in tornei e guerriglie per dimostrarsi degni. \
	                    Ma la verità è che nessuno di loro potrà mai esserlo.\
	                    Le origni dei Campioni sono più oscure di quanto si pensi: i candidati non vengono scelti tra semplici cavalieri, ma vengono \
	                    presi e cresciuti da famiglie la cui geneologia viene controllata da tempo. Vengono sottoposti a durissimi \
	                    addestramenti, che potrebbero sembrare più delle torture, ed a numerosi rituali di magia per sviluppare il loro potenziale.\
	                    Come ultimo passo il Campione, dopo avere dato prova del suo valore, si deve mozzare la lingua \
	                    di fronte al sovrano, in modo che non possa rivelare i suoi segreti.",
                move:   "Il Campione si muove in ogni direzione, a croce o in diagonale, per la distanza che vuole.",
                ability: {
                    name:   "Giuramento",
                    desc:   "Dopo essersi mosso, il Campione può spostarsi una seconda volta a patto che non si posizioni in un punto minacciato dal nemico.",
                    cost:   "10"
                }
            },
            mino: {
                name:   "Il Minotauro",
                quote:  "Mostri del cazzo creati da altri mostri del cazzo.",
                lore:   "I Minotauri sono abomini creati sotto diretto ordine del Re Rosso.\
	                    Sono i risultati degli esperimenti che univano la manipolazione genetica tramite imbreeding, praticata da secoli \
	                    su cani, cavalli, piante e, in casi più specifichi, anche su certi individui, e la magia del sangue proveniente dalle terre dell'est.\
	                    Questi esperimenti diedero vita a delle chimere con un corpo da uomo, zoccoli e testa da toro.\
	                    Il piano iniziale era quello di usarli come ..., tuttavia la loro straordinaria forza li rese un ottimo intrattenimento per i reali.\
	                    La loro aggressività è dovuta al fatto che i primi casi di ibridi riusciti erano affetti da un grave caso di schizzofrenia,\
	                    dovuta alla loro spiccata paraidolia, che gli provoca continue emicranie. \
	                    Per questo sono soliti caricare a testa bassa qualsiasi cosa sia davanti a loro.",
                move:   "Il Minotauro si muove a croce caricando il loro bersaglio.",
                ability: {
                    name:   "Berserk",
                    desc:   "Questa abilità permette ad un Minotauro di attaccare un altro bersaglio dopo aver catturato un pezzo.",
                    cost:   "5"
                }
            },
            jester: {
                name:   "Il Giullare",
                quote:  "Cosa fanno i giullari quando nessuno li guarda? Ti ascoltano.",
                lore:   "Se hai intenzione di dare un banchetto, i Giullari non possono mancare.\
	                    Li vedrai spesso scappare a zig-zag evitando i sassi lanciati dai bambini grassottelli di qualche sir o lord.\
	                    Le loro vesti sgargianti e troppo strette mettevano anche il Re Blu di buon umore.\
	                    Aveva ancora un largo sorriso quando i Giullari recapitarono la sua testa al Re Rosso.\
	                    Fuori dalle corti nessuno si sognerebbe mai di rivolgere loro neanche uno sguardo.\
	                    Molte madri del regno giurano di aver visto alcuni di loro rubare la loro prole dopo il parto. Ma sono solo storielle...\
	                    Oltre il mare vengono chiamati \"Gli occhi del Rosso\".",
                move:   "Il Giullare si muove ad L, 2 caselle in una direzione e 1 nella direzione perependicolare alla prima.",
                ability: {
                    name:   "Scherzo",
                    desc:   "Il Giullare può usare lo spazio a suo piacimento, uscire dalla scacchiera e rientrare dalla parte opposta.",
                    cost:   "5"
                }
            },
            valk: {
                name:   "La Valchiria",
                quote:  "Le donne non devono stare sul campo di battaglia, a meno che non siano ladre, puttane o valchirie.",
                lore:   "Le Valchirie nascono come un gruppo di donne sopravissute alla Grande Guerra che ha devastato le regioni occidentali, lasciando campi un tempo rigogliosi pieni zeppi di cadaveri.\
	                    Le Valchirie si organizzarono in una società matriarcale che vaga di battaglia in battaglia per dare asilo ai sopravvissuti.\
	                    I contrasti con gruppi mercenari erano frequenti, fu per questo che svilupparono un nuova branca della medicina, grazie anche all'aiuto della magia oscura.\
	                    Queste tecniche permisero loro di usare i morti per tappezzare le proprie ferite, cosa che fece perdere di vista la loro missione orginiraria.\
	                    Da sopravvissute che erano sono diventate dei macabri ammassi di carne alla ricerca di corpi da usare nei loro rituali.",
                move:   "La Valchiria si muove in diagonale.",
                ability: {
                    name:   "Lancio",
                    desc:   "La Valchiria può lanciare il suo giavelotto abbattendo i pezzi nemici, potendone saltare anche uno, senza doversi muovere.",
                    cost:   "3"
                }
            },
            bastard: {
                name:   "I Bastardi",
                quote:  "Non avere pietà di loro. Sono solo dei bastardi, dopotutto.",
                lore:   "I figli bastardi dei principi, avuti probabilmente da qualche puttana o da qualche figlia libertina di un lord minore, \
                        per sua volontà o per far ottenere un favore al padre. All'inizio della guerra i Bastardi sono stati costretti a schierarsi \
                        ed a prendere le armi in farvore del loro \"padre\", anche se per molti è difficile dire chi sia dei due. Per loro è più importante \
                        la prospettiva di un futuro roseo in cui vengono ricompensati per il loro coraggio, nella remota possibilità che non vengano catturati, fatti a pezzi o entrambe.\
                        In qualunque caso nessuno ne sentirà la mancanza.",
                move:   "I Bastardi si muovono di una casella in avanti, o di 2 se non si sono mai mossi, e possono mangiare 1 pezzo in diagonale davanti a loro.\
	                    Arrivati alla fine della scacchiera i Bastardi possono trasformarsi in un pezzo qualsiasi.",
                ability: {
                    name:   "Investitura",
                    desc:   "I Bastardi che vengono investiti della carica di lord (minore) possono comandare ai pezzi adiacenti di muoversi al loro comando, anche se solo dopo di loro.",
                    cost:   "1"
                }
            }
        }
    }
}