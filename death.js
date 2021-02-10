const system = server.registerSystem(0, 0);

system.initialize = function() {
    this.listenForEvent(`minecraft:entity_death`, (event) => {

        const deadentity = system.getComponent(event.data.entity, "minecraft:nameable");
        const killerentity = system.getComponent(event.data.killer, "minecraft:nameable");
        const deadentitypos = system.getComponent(event.data.entity, "minecraft:position");
        const { x, y, z } = deadentitypos.data;

        //runs if a player dies no matter what
        if (event.data.entity.__identifier__ === "minecraft:player") {
            system.executeCommand(`summon uhc:gravestone ${Math.round(x)} ${Math.round(y)} ${Math.round(z)}`, () => {});

            //runs if a player dies, but not to another player ... /kill seems to not trigger this
            if (event.data.entity.__identifier__ === "minecraft:player" && event.data.killer.__identifier__ !== "minecraft:player") {
                system.executeCommand(`tellraw @a {"rawtext":[{"text":"§c${deadentity.data.name} was slain at position: ${Math.round(x)}, ${Math.round(y)}, ${Math.round(z)}§r"}]}`, () => {});
            }
            //runs if a player dies to another player
            if (event.data.entity.__identifier__ === "minecraft:player" && event.data.killer.__identifier__ === "minecraft:player") {
                const killerhealth = system.getComponent(event.data.killer, "minecraft:health");
                system.executeCommand(`tellraw @a {"rawtext":[{"text":"§c${deadentity.data.name} was slain by ${killerentity.data.name} §a(${killerhealth.data.value}HP) §cat position: ${Math.round(x)}, ${Math.round(y)}, ${Math.round(z)}§r"}]}`, () => {});
                system.executeCommand(`execute ${killerentity.data.name} ~ ~ ~ function killer`, () => {});
            }
        }
    });
}