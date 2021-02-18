const system = server.registerSystem(0, 0);

system.listenForEvent("minecraft:player_attacked_entity", ({data: eventData}) => {
	const { 
		player: entity,
		attacked_entity: attackedEntity
	} = eventData

	let particleEventData = system.createEventData( "minecraft:spawn_particle_attached_entity" )
	particleEventData.data.effect = "ambient:damage_emitter"//custom particle
	particleEventData.data.offset = [ 0, 1.2, 0 ]
	particleEventData.data.entity = attackedEntity
	
	if (attackedEntity.__identifier__ !== "minecraft:player") return;//comment this line out for particles on all entities
	system.broadcastEvent("minecraft:spawn_particle_attached_entity", particleEventData)
})
console.log("attack_particles.js loaded");