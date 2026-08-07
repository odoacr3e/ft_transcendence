## Move failed

``json
{
  "game": "bastardwithvalkyriaextreme.json: \u001b[31m[KO]\u001b[0m",
  "info": "AIExecuteTurn: move failed. Info: {\n  \"move\": {\n    \"from\": \"a1\",\n    \"to\": \"b1\"\n  },\n  \"moveBoost\": null,\n  \"boost\": \"\",\n  \"transform\": \"\"\n}",
}
``

## Update Champion

``json
{
  "game": "bug_miss_valkyria.json: \u001b[31m[KO]\u001b[0m",
  "board": "| |bK| | | | |bJ| |\n|bB| |bB| | | |bB|bB|\n| | | |bV| | |bC| |\n| | | |wB| |bB| | |\n| |bB|wB| |+bM|wB| | |\n| |wB| |wV| | | |wJ|\n|wB| | |wB|wM| | |wB|\n| | |wM| | |wK| | |\n|00|",
  "info": "updateBoostedChampions: piece in d1 does not exist",
}
``

## Invalid position chessboard

``json
{
  "game": "bugboostbastard.json: \u001b[31m[KO]\u001b[0m",
  "board": "|bM|bJ| |bC|bK|bV|bJ|bM|\n|bB|bB| |bV|bB|bB|bB|bB|\n| | |bB| | | | | |\n| | | |wB| | | | |\n| | | | | | | | |\n| |wV| | | |wC| | |\n|wB|wB|wB|wB| |wB|wB|wB|\n|wM|wJ|wV| |wK| |wJ|wM|\n|00|",
  "info": "ChessBoard: invalid position ",
}
``

## ✅Boost failed

``json
{
  "game": "champ_danger_weird.json: \u001b[31m[KO]\u001b[0m",
  "board": "|bM| |bV| |bK|bV| |bM|\n| |bB| |bB|bB|bB|bB| |\n|bB| |bJ| | | | | |\n|bC|+wV|+bB|wB| | | |bB|\n| | |wB| |wB| | | |\n| | | | |wB| | | |\n|wB|wB| |wV| | |wB|wB|\n|wM|wJ| |wC|wK| |wJ|wM|\n|00|",
  "info": "AIExecuteTurn: boost failed. Info: {\n  \"move\": {\n    \"from\": \"c1\",\n    \"to\": \"d2\"\n  },\n  \"moveBoost\": null,\n  \"boost\": \"b5\",\n  \"transform\": \"\"\n}",
}
``

## boost already boost piece

## Cancel turn

``json
{
  "game": "fresh 1: \u001b[31m[KO]\u001b[0m",
  "board": "|bM|bJ|bV| |bK|bV|bJ|bM|\n| |bB|bB|bB| |bB|bB|bB|\n| | | | |bB| | | |\n| | |bC| | | | | |\n|bB| |wJ| | | | | |\n| |wB| |wB| | | | |\n|+wB| |wB| |wB|wB|wB|wB|\n|wM| |wV|wC|wK|wV|wJ|wM|\n|00|",
  "info": "cancelTurn: last turn is not endTurn:{\n  \"move\": {\n    \"from\": \"a5\",\n    \"to\": \"a4\"\n  },\n  \"moveBoost\": null,\n  \"boost\": \"\",\n  \"transform\": \"\"\n}
}
``

## Trasfiguration failed

``json
{
  "game": "bugboostbastard.json: \u001b[31m[KO]\u001b[0m",
  "board": "|bM| | | |wB|wC| |bM|\n|+bB|bB| | | |bB| |bB|\n|bC| |bJ|bK| | |bB| |\n| |bB| | | | | | |\n| | | | | | | | |\n|wJ| | | | | | | |\n|wB|wB|wB|wB| |wB|wB|wB|\n| |wM|wV|wK| | |+wJ|wM|\n|00|",
  "info": "execTurn: transfiguration has failed",
}
``