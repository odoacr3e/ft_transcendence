export const english = {
    messages: {
        common: {
            search: "Search",
            players: "Players",
            tournament: "Tournament | Tournaments",
            accept: "Accept",
            reject: "Reject",
            pending: "Pending...",
            friend: "Friend | Friends",
            win: "Win | Wins",
            lose: "Defeat | Defeats",
            draw: "Draw | Draws",
            game: "Game | Games",
            by: "by",
            or: "or"
        },
        header: {
            inv: {
                creation: "Created {date} @:common.by",
                desc: "You've been invited to the <b>{tourName}</b> @.lower:common.tournament created @:common.by {tourCreator}.<br>Would you like to participate?",
                expired: "Invitation no longer valid",
                friendTitle: "@:common.friend request",
                tourTitle: "@:common.tournament invitation",
                friendNotif : "{sender} sent you a @.lower:common.friend request",
                tourNotif: "{sender} has invited you to participate in the {tour} @.lower:common.tournament"
            },
            zeroNotif: "No notifications",
            profile: "Profile",
            settings: "Settings",
            logout: "Logout",
            login: "Login"
        },
        menu: {
            userList: "{nUser} users found for \"<b>{search}</b>\"",
            online: "Play online",
            offline: "Play offline",
            lBoard: "Leader Board",
            codex: "Codex"
        },
        login: {
            val: {
                name: "Name",
                surname: "Surname",
                nationality: "Nationality",
                theme: "Theme"
            },
            OTP: {
                auth: "OTP Authentication",
                desc: "Enter the code sent to you by email.",
                exp: "It'll expire in {date}",
                on: "On",
                off: "Off"
            },
            err: {
                title: "Wrong credentials",
                wrong: "Incorrect username or password.",
                tooMany: 'Too many attempts made.',
                clone: "A user with these\ncredentials already exists",
				username: "The username must be\nat least 4 characters long",
				email: "Please make sure you\nhave entered a valid email",
				password: "The password must contain:\n\
                            - at least 8 characters\n- a number\n\
                            - an uppercase letter\n- a lowercase letter\n\
                            - a special character ($, %, #...)"
            },
            welcome: "Welcome!",
            wellback: "Welcome back!",
            signIn: "Sign in",
            forgot: "Forgot password?",
            loginAcc: "@:header.login with your account",
            missingAcc: "Don't have an account yet?",
            google: "Continue with Google"
        },
        leaderBoard: {
            title: "Top 10 @.lower:common.players",
            outOf: "out of {games}",
        },
        tournaments: {
            newTour: "Create a new @.lower:{'common.tournament'}!",
            placeholder: "@:common.tournament name",
            creator: "Creator of the @.lower:{'common.tournament'}:",
            button: "Create",
            ongoing: "Ongoing...",
            closed: "Closed",
            noTour: "No @.lower:common.tournament"
        },
        userPage: {
            edit: {
                infoU: "User's info",
                changeAvatar: "Change avatar",
                removeAvatar: "Remove avatar",
                changePwd: "Change password",
                newPwd: "New password",
                saveChanges: "Save changes",
                desc: "The password must contain at least 8 characters, a number, an uppercase and a lowercase letter and a special character ($,%,#...)"
            },
            friendList: "Friends list",
            removeFriend: "Remove @.lower:common.friend",
            friendRequest: "@:common.friend requests",
            pendingRequest: "No pending requests",
            matchHistory: "Match history",
            sendRequest: "Send @.lower:common.friend request"
        },
        codex: {
            king: {
                name:   "The King",
                quote:  "'Black or White' they ask. I've got better things to do.",
                lore:   "Sons of the old Red King, the twins Black and White has lived a comfortable life, without the worries of ordinary peons.\
	                    After the death of the Red King caused by a bee's sting, there were little to no instructions for the heir to the throne, and\
	                    the twins started to childishly bicker like two spoiled kids.\
	                    The White prince, who made a fool of himself up till that moment, decided to declare war over his own brother.\
                        What kind of king will the kingdom have is not something that everyone can predict or know, \
                        but the only sure thing is that they'll do whaterever they can to not lose this war.",
                move:   "The King can move up to 1 square in any direction, until he's not under his foes' fire.",
                ability: {
                    name:   "Last to fall",
                    desc:   "\"What kind of king will thou be?\" is a question you'll have to answer, \
                            and this will give you an incredible strength as soon as you'll reamin the last to stand.",
                    cost:   "0"
                }
            },
            champ: {
                name:   "The Champion",
                quote:  "...",
                lore:   "The Champions are not only the King's personal knights, but also a true emblem of strength.\
                        They're tall, fast, deadly and men of few words. Every true knight dreams to earn one day this title and they \
	                    usually joust and fight in tournaments and warfares to prove themselves worthy.\
                        But the truth is that none of them will ever become a Champion.\
                        The origins of these men dwell in a dark shadow of history: the candidates are not simple men and knights, but \
	                    descendants of families which genealogy has been controlled for ages. They're force to undergo \
	                    extremely tough trainings, which look like more tortures, and magic rituals to develop all of their potential.\
	                    After proving their worth, the last step to become a Champion is to cut their tounge in front of the King \
	                    so that they may never reaveal Their Majesty's secrets.",
                move:   "The Champion can move in any direction, diagonally or in a cross, and at any distant they want.",
                ability: {
                    name:   "Vow",
                    desc:   "After their turn, the Champion can move a second time as long as they end up in an endanged square.",
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