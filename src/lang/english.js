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
                expired: "Invitation no longer valid"
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
                saveChanges: "Save changes"
            },
            friendList: "Friends list",
            removeFriend: "Remove @.lower:common.friend",
            friendRequest: "@:common.friend requests",
            pendingRequest: "No pending requests",
            matchHistory: "Match history",
            sendRequest: "Send @.lower:common.friend request"
        }

    }
}