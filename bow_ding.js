const system = server.registerSystem(0, 0);

system.listenForEvent("minecraft:entity_hurt", ({ data: eventData }) => {
    const { attacker, entity, projectile_type } = eventData;

    if (attacker.__identifier__ == "minecraft:player" && entity.__identifier__ == "minecraft:player" && projectile_type == "arrow") {
        const attackerName = system.getComponent(attacker, "minecraft:nameable").data.name;
        system.executeCommand(`execute "${attackerName}" ~ ~ ~ playsound random.orb @s ~ ~ ~ 0.4 0.5`, () => {});
        OnNextTickSend(entity, attackerName);
    }
});

//get attacked entity health after taking damage
function OnNextTickSend(entity, attackerName) {
    let tick = false; {
        system.update = function() {
            if (tick == false) {
                const entityHealth = system.getComponent(entity, "minecraft:health").data.value;
                const entityName = system.getComponent(entity, "minecraft:nameable").data.name;
                system.executeCommand(`tellraw "${attackerName}" {"rawtext":[{"text":"§e${entityName} is at §c${entityHealth} §ehealth!§r"}]}`, () => { tick = true; });
            }
        };
    }
}