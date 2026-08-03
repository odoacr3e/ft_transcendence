import LeaderBoard from "@/views/LeaderBoard.vue";

export const english = {
    messages: {
        common: {
            search: "Search",
            players: "Players",
            tournament: "Tournament | Tournaments",
            accept: "Accept",
            reject: "Reject",
            by: "by"
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
            closed: "Closed"
        }

    }
}