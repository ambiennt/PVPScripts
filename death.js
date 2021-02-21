const system = server.registerSystem(0, 0);

system.initialize = function() {
    this.listenForEvent(`minecraft:entity_death`, (event) => {

        const deadEntity = system.getComponent(event.data.entity, "minecraft:nameable");
        const killerEntity = system.getComponent(event.data.killer, "minecraft:nameable");
        const deadEntityPos = system.getComponent(event.data.entity, "minecraft:position");
        const { x, y, z } = deadEntityPos.data;

        //runs if a player dies no matter what - gravestone still works if player dies in lava
        if (event.data.entity.__identifier__ === "minecraft:player") {
        	system.executeCommand(`fill ${x-5} ${y-3} ${z-5} ${x+5} ${y+3} ${z+5} air 0 replace lava`, () => {});
        	system.executeCommand(`fill ${x-5} ${y-3} ${z-5} ${x+5} ${y+3} ${z+5} air 0 replace fire`, () => {});
        	system.executeCommand(`setblock ${Math.floor(x)} ${Math.floor(y-1)} ${Math.floor(z)} bedrock`, () => {});
            system.executeCommand(`summon uhc:gravestone ${Math.floor(x)} ${Math.floor(y)} ${Math.floor(z)}`, () => {});

            //if a player was killed by another player
            if (event.data.killer && event.data.killer.__identifier__ === "mineraft:player") {
                const killerHealth = system.getComponent(event.data.killer, "minecraft:health");
                system.executeCommand(`tellraw @a {"rawtext":[{"text":"§c${deadEntity.data.name} was slain by ${killerEntity.data.name} §a(${killerHealth.data.value}HP) §cat position: ${Math.round(x)}, ${Math.round(y)}, ${Math.round(z)}§r"}]}`, () => {});
                system.executeCommand(`execute ${killerEntity.data.name} ~ ~ ~ function killer`, () => {});
            }

            //runs if a player dies, but not to another player
            else {
                system.executeCommand(`tellraw @a {"rawtext":[{"text":"§c${deadEntity.data.name} was slain at position: ${Math.round(x)}, ${Math.round(y)}, ${Math.round(z)}§r"}]}`, () => {});
            }
        }
    });
}
console.log("death.js loaded");
