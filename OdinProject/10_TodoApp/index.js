// Todo app
// Renz Torres, Odin Project

/* const fs = require('fs'); // need to find something different for web
const path = require('path'); // need to find something different for web
 */

const globalTags = new Set();

const Tag = (content) => {
    content = content.toLowerCase();
    globalTags.add(content);

    return content;
}

const TagLibrary = (...tags) => {
    const list = new Set();

    const get = () => {return list}

    const add = (...tags_) => {
        for (let tag_ of tags_) {
            list.add(Tag(tag_));
        }
    }

    add(...tags);

    const drop = (tag) => {
        if (list.has(tag)) {
            list.delete(tag);
        }
    }

    const size = () => {
        return list.size;
    }

    return {
        get,
        add,
        drop,
        size,
    }
}

const ID = (() => {
    let id = -1;

    const get = () => {
        id += 1;
        return id
    }

    return {get}
})();

const Todo = (title, description = undefined,
    dueDate = undefined, modified = new Date(Date.now()),
    created = new Date(Date.now()), completed = false,
    priority = 3, ...tags) => {

    const id = ID.get();
    title = title.slice(0, 140);
    if (dueDate) {dueDate = new Date(dueDate)};
    let tagLibrary = TagLibrary(...tags);
    let checklist = Library();

    const modify = () => {
        modified = new Date(Date.now());
    }

    const get = (arg) => {
        const returnable = {
            id,
            title,
            description,
            dueDate,
            priority,
            checklist,
            tags: tagLibrary.get(),
            created,
            modified,
            completed
        };

        if (arg in returnable) {
            return returnable[arg];
        }
        else {
            return returnable;
        }
    };

    const edit = (title_, description_, dueDate_, priority_) => {
        modify();
        if (title != title_) {title = title_.slice(0,140);}
        if (description != description_) {description = description_}
        if (dueDate != dueDate_) {dueDate = new Date(dueDate_)}
        if (priority != priority_) {priority = priority_}
    }

    const toggleCompleted = () => {
        modify();
        completed = !completed;
    }


    return {
        id,
        get,
        edit,
        toggleCompleted
    }
}

const Library = () => {
    let todos = [];

    const count = () => {return notes.length}

    const getAll = (info = false) => {
        return info ? todos.map(x => x.get()) : todos;
    }

    const get = (id) => {
        return todos.filter(x => {return x.id == id})[0];
    }

    const getByTag = (...tags) => {
        return getAll().filter(x => {
            for (let t of tags) {
                if (x.tags.has(t)) {
                    return true;
                }
            }
            return false;
        })
    }

    const add = (todo) => todos.push(todo);

    const drop = (id) => {
        todos = todos.filter(x => x.id != id);
    }

    const markAllCompleted = () => {
        for (let todo of todos) {
            if (!todo.get("completed")) {
                todo.toggleCompleted();
            }
        }
    }

/*     const exportToJSON = (filePath = ".", name_ = "todo.json") => {
        let exportData = getAll(info = true);
        for (let d of exportData) {
            d.tags = [...d.tags];
        }

        exportData = JSON.stringify(exportData);


        if (fs.existsSync(filePath)) {
            fs.writeFileSync(path.join(filePath, name_), exportData);
        }
    } */

/*     const importFromJSON = (file) => {
        let data = fs.readFileSync(file, "utf-8");
        data = JSON.parse(data);

        for (let obj of data) {

            if (!("created" in obj)) {obj.created = Date.now();}
            if (!("modified" in obj)) {obj.modified = Date.now();}
            if (!("completed" in obj)) {obj.completed = false;}
            //let newTodo = Todo(obj.content, obj.modified, obj.created, obj.completed, ...obj.tags);
            add(newTodo);
        }

    } */

    return {
        count,
        getAll,
        get,
        getByTag,
        add,
        drop,
        markAllCompleted,
/*         exportToJSON,
        importFromJSON */
    }
}

const AllView = (todos) => {
    todos = todos.map(x => {
        return {
            functions: x,
            data: x.get()
        }
    });

    const container = document.createElement("div");
    container.classList.add("view-all");

    const addDiv = document.createElement("div");
    addDiv.classList.add("add-new");
    const addButton = document.createElement("button");
    addButton.textContent = "➕";
    addDiv.appendChild(addButton);

    const title = document.createElement("h1");
    title.textContent = "Library";

    const todoList = document.createElement("div");
    todoList.classList.add("todo-list");

    const todoDivs = todos.map(todo => {
        let todoDiv = document.createElement("div");
        todoDiv.id = todo.data.id;
        todoDiv.classList.add("todo-item");

        let todoP = document.createElement("p");
        todoP.textContent = todo.data.title;

        let menu = document.createElement("menu");
        let completeButton = document.createElement("button");
        completeButton.textContent = todo.data.completed ? "✅" : "✔️";

        let viewMoreButton = document.createElement("button");
        viewMoreButton.textContent = "🔍";

        menu.appendChild(viewMoreButton);
        menu.appendChild(completeButton);

        todoDiv.appendChild(todoP);
        todoDiv.appendChild(menu);

        todoList.appendChild(todoDiv);

        return {
            functions: todo.functions,
            getData: todo.functions.get,
            presentation: {
                div: todoDiv,
                text: todoP.textContent,
                button: completeButton,
                viewMore: viewMoreButton,
            }
        }
    })

    container.appendChild(title);
    container.appendChild(addDiv);
    container.appendChild(todoList);
    
    return {
        container,
        todoList,
        todoElements: todoDivs,
        addButton,
        type: "view-all",
    }

}

const SingleView = (todo) => {
    todo = {
        functions: todo,
        data: todo.get(),
    };

    const container = document.createElement("div");
    container.classList.add("view-single");

    const title = document.createElement("h1");
    title.textContent = todo.data.title;
    title.classList.add("title");

    const description = document.createElement("p");
    description.classList.add("description");
    description.textContent = todo.data.description;

    const tags = document.createElement("ul");
    tags.classList.add("tags");
    for (let tag of todo.data.tags) {
        let tagItem = document.createElement("li");
        tagItem.textContent = tag;
        tags.appendChild(tagItem);
    }

    const priority = document.createElement("div");
    priority.classList.add("priority");

    const dueDate = document.createElement("p");
    dueDate.classList.add("due-date");
    dueDate.textContent = `Due: ${todo.functions.get("dueDate").toISOString().slice(0,10)}`;
    const priorityLevel = document.createElement("p");
    priorityLevel.textContent = `Priority: ${todo.data.priority}`;
    priority.appendChild(dueDate);
    priority.appendChild(priorityLevel);

    const metadata = document.createElement("div");
    metadata.classList.add("metadata");
    const metaCreated = document.createElement("p");
    metaCreated.classList.add("created");
    metaCreated.textContent = `Created: ${todo.data.created.toISOString().slice(0,10)}`
    const metaModified = document.createElement("p");
    metaModified.classList.add("modified");
    metaModified.textContent = `Last modified: ${todo.data.modified.toISOString().slice(0,10)}`;
    metadata.appendChild(metaCreated);
    metadata.appendChild(metaModified);

    const menu = document.createElement("menu");
    const completeButton = document.createElement("button");
    completeButton.textContent = todo.data.completed ? "✅" : "✔️";

    const editButton = document.createElement("button");
    editButton.textContent = "✏️";

    const returnButton = document.createElement("button");
    returnButton.textContent = "⬆️";

    for (let b of [completeButton, editButton, returnButton]) {menu.appendChild(b)};

    for (let element of [title, description, priority, tags, menu, metadata]) {container.appendChild(element)};

    return {
        container,
        title,
        description,
        completeButton,
        tags,
        priority,
        created: metaCreated,
        modified: metaModified,
        type: "view-single",
        editButton,
        returnButton,
        todo: {
            functions: todo.functions,
            getData: todo.functions.get,
        }
    };

}

const EditView = (todo) => {
    const container = document.createElement("div");
    container.classList.add("view-edit");

/*     const titleLabel = document.createElement("label");
    titleLabel.for = "title";
    titleLabel.textContent = "Title"; */
    const title = document.createElement("input");
    title.id = "Title";
    title.classList.add("title");
    title.value = todo.get("title");

/*     const descriptionLabel = document.createElement("label");
    descriptionLabel.for = "description";
    descriptionLabel.textContent = "Description"; */
    const description = document.createElement("textarea");
    description.id = "Description";
    description.classList.add("description");
    description.size = 50;
    description.value = todo.get("description");

/*     const dueDateLabel = document.createElement("label");
    dueDateLabel.for = "duedate";
    dueDateLabel.textContent = "Due Date"; */
    const dueDate = document.createElement("input");
    dueDate.type = "date";
    dueDate.id = "duedate";
    dueDate.classList.add("due-date");
    dueDate.value = todo.get("dueDate").toISOString().slice(0,10);

/*     const priorityLabel = document.createElement("label");
    priorityLabel.for = "priority";
    priorityLabel.textContent = "Priority"; */
    const priority = document.createElement("input");
    priority.type = "number";
    priority.min = 1;
    priority.max = 5;
    priority.id = "priority";
    priority.classList.add("priority");
    priority.value = todo.get("priority");

    const submitButton = document.createElement("button");
    submitButton.textContent = "🔃";

    for (let element of [title, description, dueDate, priority, submitButton]) {
        container.appendChild(element);
    }

    return {
        container,
        title,
        description,
        dueDate,
        priority,
        submitButton,
        todo: {
            functions: todo,
            getData: todo.get,
        },
        type: "edit",
    };
}

const AddView = () => {
    const container = document.createElement("div");
    container.classList.add("add-new");

/*     const titleLabel = document.createElement("label");
    titleLabel.for = "title";
    titleLabel.textContent = "Title"; */
    const title = document.createElement("input");
    title.id = "Title";
    title.classList.add("title");
    title.value = "Untitled";

/*     const descriptionLabel = document.createElement("label");
    descriptionLabel.for = "description";
    descriptionLabel.textContent = "Description"; */
    const description = document.createElement("textarea");
    description.id = "Description";
    description.classList.add("description");
    description.size = 50;

/*     const dueDateLabel = document.createElement("label");
    dueDateLabel.for = "duedate";
    dueDateLabel.textContent = "Due Date"; */
    const dueDate = document.createElement("input");
    dueDate.type = "date";
    dueDate.id = "duedate";
    dueDate.classList.add("due-date");
    let tempVal = new Date();
    dueDate.value = tempVal.toISOString().slice(0,10);

/*     const priorityLabel = document.createElement("label");
    priorityLabel.for = "priority";
    priorityLabel.textContent = "Priority"; */
    const priority = document.createElement("input");
    priority.type = "number";
    priority.min = 1;
    priority.max = 5;
    priority.id = "priority";
    priority.classList.add("priority");
    priority.value = 3;

    const submitButton = document.createElement("button");
    submitButton.textContent = "🔃";

    for (let element of [title, description, dueDate, priority, submitButton]) {
        container.appendChild(element);
    }

    return {
        container,
        title,
        description,
        dueDate,
        priority,
        submitButton,
        type: "add-new",
    };
}


const Controller = (library) => {
    function clear() {
        for (let element of document.querySelectorAll("main > *")) {
            element.remove();
        }
    }

    const mainNode = document.querySelector("main");

    let currentView;
    const setView = (view, ...args) => {
        clear();
        if (view == "view-all") {
            currentView = AllView(library.getAll());
            currentView.addButton.addEventListener("click", () => {
                setView("add-new");
            })
            for (let t of currentView.todoElements) {
                t.presentation.button.addEventListener("click", () => {
                    t.functions.toggleCompleted();
                    t.presentation.button.textContent = t.getData("completed") ? "✅" : "✔️";
                });
                t.presentation.viewMore.addEventListener("click", () => {
                    currentView = setView("view-single", t.getData("id"));
                })
            }
        }

        else if (view == "view-single") {
            currentView = SingleView(library.get(args));
            let t = currentView.todo;
            let c = currentView
            currentView.completeButton.addEventListener("click", () => {
                t.functions.toggleCompleted();
                c.completeButton.textContent = t.getData("completed") ? "✅" : "✔️";
                c.modified.textContent = `Last modified: ${t.getData("modified").toISOString().slice(0,10)}`;
            });
            currentView.editButton.addEventListener("click", () => {
                setView("edit", t.functions.id);
            });
            currentView.returnButton.addEventListener("click", () => {
                setView("view-all");
            });
        }

        else if (view == "edit") {
            currentView = EditView(library.get(args));
            currentView.submitButton.addEventListener("click", () => {
                let newTitle = currentView.title.value;
                let newDesc = currentView.description.value;
                let newDate = currentView.dueDate.value;
                let newPriority = currentView.priority.value;

                currentView.todo.functions.edit(newTitle, newDesc, newDate, newPriority);

                setView("view-single", currentView.todo.functions.get("id"));
            })
        }

        else if (view == "add-new") {
            currentView = AddView();
            currentView.submitButton.addEventListener("click", () => {
                let newTitle = currentView.title.value;
                let newDesc = currentView.description.value;
                let newDate = currentView.dueDate.value;
                let newPriority = currentView.priority.value;

                library.add(Todo(newTitle, newDesc, newDate, newPriority));
                
                setView("view-all");
            })
        }

        else {}

        mainNode.append(currentView.container);
    }

    return {
        anchor: mainNode,
        setView
    }

}

const main = () => {
    const library = Library();
    const todo1 = Todo("Lorem ipsum", "This is a description", "2022-08-01", undefined, undefined, undefined, undefined, "gay", "really gay")
    const todo2 = Todo("Loborbum ibipsub", "This is a second description", "2022-09-01", undefined, undefined, undefined, undefined, "gay", "extremely gay", "woah");

    library.add(todo1);
    library.add(todo2);

    const controller = Controller(library);
    controller.setView("view-all");
}

main();