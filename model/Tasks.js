const { ObjectId } = require("mongodb");

function createTask({ title, description, status, priority, dueDate, userId }) {
    return {
        _id: new ObjectId(),
        title,
        description: description || "",
        status: status || "Todo",        // Todo | In Progress | Done
        priority: priority || "Medium",  // Low | Medium | High
        dueDate: dueDate ? new Date(dueDate) : null,
        userId: new ObjectId(userId),    //  link task to user
        createdAt: new Date(),
        updatedAt: new Date()
    };
}

module.exports = { createTask };
