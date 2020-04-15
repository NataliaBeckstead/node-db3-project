const db = require('../data/db-config.js');

module.exports = {
    find,
    findById,
    findSteps,
    add,
    addStep,
    update,
    remove
};

function find() {
    return db("schemes");
}

function findById(id) {
    return db("schemes").where({ id }).first();
}

function findSteps(id) {
    return db("steps")
        .join("schemes", "schemes.id", "steps.scheme_id")
		.select(
            "schemes.scheme_name",
            "steps.step_number",
			"steps.instructions"
        )
        .orderBy('step_number', 'asc')
		.where({ scheme_id: id });
}

function add(schemeData) {
    return db("schemes")
        .insert(schemeData, "id")
        .then(([id]) => {
            return findById(id);
        })
}

function addStep(stepData, scheme_id) {
    return db("steps")
        .insert({ ...stepData, scheme_id })
        .then(([id]) => db("steps").where({ id }).first());
}

function update(changes, id) {
	return db("schemes")
		.where({ id })
		.update(changes)
		.then(() => findById(id));
}

function remove(id) {
	return findById(id).then((scheme) => {
		return db("schemes")
			.where({ id })
			.del()
			.then(() => scheme);
	});
}