const system = server.registerSystem(0, 0);

system.listenForEvent("minecraft:projectile_hit", ({ data: eventData }) => {
    const { owner, entity, projectile } = eventData;

    if (owner.__identifier__ === "minecraft:player" && entity.__identifier__ === "minecraft:player" && projectile.__identifier__ === "minecraft:arrow") {
        const ownerName = system.getComponent(owner, "minecraft:nameable").data.name;
        system.executeCommand(`execute "${ownerName}" ~ ~ ~ playsound random.orb @s ~ ~ ~ 0.4 0.5`, () => {});
        OnNextTickSend(entity, ownerName);
    };
});

//get attacked entity health after taking damage
function OnNextTickSend(entity, ownerName) {
    let tick = false;
    system.update = function() {
      if (tick == false) {
        const entityHealth = system.getComponent(entity, "minecraft:health").data.value;
        const entityName = system.getComponent(entity, "minecraft:nameable").data.name;
        system.executeCommand(`tellraw "${ownerName}" {"rawtext":[{"text":"§e${entityName} is at §c${entityHealth} §ehealth!§r"}]}`, () => { tick = true; });
    };
  };
};
