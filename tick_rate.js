const system = server.registerSystem(0, 0);

var hour_ticks = Date.now();
var ticks = 0;
var pos = 0;

system.update = function () {
    //60000 = 1 minute in ms
    ticks++;
    if ((hour_ticks < Date.now() - 120000)) {
        system.executeCommand('tellraw @a {"rawtext":[{"text":"§cTPS: ' + (ticks/120).toFixed(2) + '"}]}', {});
        ticks = 0;
        hour_ticks = Date.now();
    }
};