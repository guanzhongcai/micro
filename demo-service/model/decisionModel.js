let model = module.exports;

let map = new Map(); // uid -> user

model.addUser = function (uid, user) {

    map.set(uid, user);
};

model.deleteUser = function (uid) {

    const ok = map.get(uid);
    if (ok) {
        map.delete(uid);
    }
    return ok;
};


