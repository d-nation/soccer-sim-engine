var state = {
    "game": {
        "half": 1,
        "time": "00:00",
        "stoppage": 0, //minutes of stoppage time
        "score": {
            "home": 0,
            "away": 0
        },
        "possession": {
            "current": 1, //0=None, 1=Home, 2=Away
            "home": 0, //time
            "away": 0, //time
            "player": null //ID of player with possession.  null=No player has possession.
        },
        "pitch": {
            "current": [5,4], //uses grid system ranges [1-8, 1-6]
            "status": 0 //0=Kickoff, 1=In Play, 2=Free Kick, 3=ThrowIn, 4=GoalKick, 5=CornerKick, 6=Penalty, 7=Goal, 8=Out of Touch(ThrowIn), 9=Out of Touch(GoalKick)
        },
        "previousPlay": 0 //0=Kickoff, 1=Pass, 2=MoveWithBall, 3=Shot, 4=Foul, 5=Free Kick, 6=ThrowIn, 7=GoalKick, 8=CornerKick, 9=Penalty, 10=Goal, 11=Out of Touch(ThrowIn), 12=Out of Touch(GoalKick)
    }
};