//@ts-check

class Room
{
    /** @param {number} ownerId */
    constructor (ownerId)
    {
        this.id = `${Date.now}_${ownerId}`;
        this.player = new Set();
        this.player.add(ownerId);
    }
}