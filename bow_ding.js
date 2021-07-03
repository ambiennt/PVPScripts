const system = server.registerSystem(0, 0);

system.listenForEvent("minecraft:projectile_hit", ({ data: eventData }) => {
    const { owner, entity, projectile } = eventData;

    if (owner.__identifier__ == "minecraft:player" && entity.__identifier__ == "minecraft:player" && projectile.__identifier__ == "minecraft:arrow") {
        const ownerName = system.getComponent(owner, "minecraft:nameable").data.name;
        const entityName = system.getComponent(entity, "minecraft:nameable").data.name;
        //exit script when a player shoots themselves with an arrow
        if (ownerName == entityName) return;
        system.executeCommand(`execute "${ownerName}" ~ ~ ~ playsound random.orb @s ~ ~ ~ 0.375 0.5`, () => {});
        let sendTellraw = true;
        OnNextTickSend(sendTellraw, entity, ownerName);
    }
});

//get attacked entity health after taking damage
function OnNextTickSend(sendTellraw, entity, ownerName) {
    system.update = function() {
        if (sendTellraw) {
            const entityHealth = system.getComponent(entity, "minecraft:health").data.value;
            const entityName = system.getComponent(entity, "minecraft:nameable").data.name;
            system.executeCommand(`tellraw "${ownerName}" {"rawtext":[{"text":"§e${entityName} is at §c${entityHealth} §ehealth!§r"}]}`, () => { sendTellraw = false; });
        }
    };
};
