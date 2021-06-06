const system = server.registerSystem(0, 0);

system.listenForEvent("minecraft:player_attacked_entity", ({data: eventData}) => {
	const { 
		player: entity,
		attacked_entity: attackedEntity
	} = eventData
	
	let handContainer = system.getComponent(entity, "minecraft:hand_container");
	let mainhandItem = handContainer.data[0];

	//check if attacked entity is a player and the attacker has a sword in their main hand
	if (attackedEntity.__identifier__ == "minecraft:player" && mainhandItem.item.includes("sword")) {

		let particleEventData = system.createEventData( "minecraft:spawn_particle_attached_entity" )
		particleEventData.data.effect = "ambient:hit_particle"//custom particle
		particleEventData.data.offset = [ 0, 0.5, 0 ]
		particleEventData.data.entity = attackedEntity
		system.broadcastEvent("minecraft:spawn_particle_attached_entity", particleEventData)
	};
})
