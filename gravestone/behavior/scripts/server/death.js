const system = server.registerSystem(0, 0);

system.listenForEvent("minecraft:entity_death", (event) => {

    if (event.data.entity.__identifier__ != "minecraft:player") return;
    const deadEntity = system.getComponent(event.data.entity, "minecraft:nameable");
    const killerEntity = system.getComponent(event.data.killer, "minecraft:nameable");
    const { x, y, z } = system.getComponent(event.data.entity, "minecraft:position").data;

    //runs if a player dies no matter what
    system.executeCommand(`setblock ${x} ${y-1} ${z} bedrock`, () => {});
    system.executeCommand(`summon uhc:gravestone ${Math.floor(x)} ${Math.floor(y)} ${Math.floor(z)} minecraft:entity_spawned "§a${deadEntity.data.name}'s gravestone§r"`, () => {});

    //if a player was killed by another player
    if (event.data.killer && event.data.killer.__identifier__ == "minecraft:player") {
        const killerHealth = system.getComponent(event.data.killer, "minecraft:health");
        system.executeCommand(`tellraw @a {"rawtext":[{"text":"§c${deadEntity.data.name} was slain by ${killerEntity.data.name} §a(${killerHealth.data.value}HP) §cat position: ${Math.round(x)}, ${Math.round(y)}, ${Math.round(z)}"}]}`, () => {});
    }

    //runs if a player dies, but not to another player
    else {
        system.executeCommand(`tellraw @a {"rawtext":[{"text":"§c${deadEntity.data.name} was slain at position: ${Math.round(x)}, ${Math.round(y)}, ${Math.round(z)}"}]}`, () => {});
    }  
});
