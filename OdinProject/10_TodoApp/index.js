// Todo app
// Renz Torres, Odin Project

/* const fs = require('fs'); // need to find something different for web
const path = require('path'); // need to find something different for web
 */

const globalTags = (() => {
    let list = new Set();
    const get = () => {
        return Array.from(list);
    }

    const update = (library) => {
        let newList = new Set();
        for (let todo of library.getAll()) {
            let tempList = todo.get("tags");
            if (tempList.length) {
                for (let item of tempList) {
                    newList.add(item);
                }
            }
        }
        list = newList;
    }

    return {
        list,
        get,
        update
    }
})();

const Tag = (content) => {
    content = content.toLowerCase();
    globalTags.list.add(content);

    return content;
}

const TagLibrary = (...tags) => {
    const list = new Set();

    const get = () => {return Array.from(list)}

    const getAsString = () => {
        let array = get();
        return array.length ? array.join() : "";
    }

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

    const setFromString = (str) => {
        let userTags = str.split(",");
        if (userTags.length && !list.size) {
            for (let t of userTags) {list.add(t)}
        }
        else if (!userTags.length && list.size) {
            list.forEach(x => list.delete(x));
        }
        else if (userTags.length && list.size) {
            // delete list tags not contained in userTags
            list.forEach(x => {
                if (!userTags.includes(x)) {list.delete(x)}
            })
            // add userTag not contained in list
            userTags.forEach(x => {
                if (!list.has(x)) {list.add(x)};
            })
        }
        else {}
    }

    const size = () => {
        return list.size;
    }

    return {
        get,
        getAsString,
        add,
        drop,
        size,
        setFromString,
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
            tagsAsString: tagLibrary.getAsString(),
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

    const edit = (title_, description_, dueDate_, priority_, tags_) => {
        modify();
        if (title != title_) {title = title_.slice(0,140)};
        if (description != description_) {description = description_};
        if (dueDate != dueDate_) {dueDate = new Date(dueDate_)};
        if (priority != priority_) {priority = priority_};
        tagLibrary.setFromString(tags_);
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

    const getByTag = (tag) => {
        let returnable = getAll().filter(x => {
            return x.get("tags").includes(tag);
        });
        return returnable;

    }

    const add = (todo) => todos.push(todo);

    const drop = (id) => {
        todos = todos.filter(x => x.id != id);
    }

/*     const markAllCompleted = () => {
        for (let todo of todos) {
            if (!todo.get("completed")) {
                todo.toggleCompleted();
            }
        }
    } */

    const setLocalStorage = () => {
        let storables = getAll(true);
        if (storables.length) {
            localStorage.setItem('todos', JSON.stringify(storables));
        }
    }

    const getLocalStorage = () => {
        let imp = localStorage.getItem('todos');
        if (imp) {
            imp = JSON.parse(imp);
            if (confirm("Override existing data?")) {
                for (let t of todos) {
                    drop(t.id);
                }
            }
            for (let todo of imp) {
                add(Todo(todo.title, todo.description, todo.dueDate,
                    todo.modified, todo.created, todo.completed,
                    todo.priority, ...todo.tags))
            }
        }

    }

    return {
        count,
        getAll,
        get,
        getByTag,
        add,
        drop,
        setLocalStorage,
        getLocalStorage,
    }
}

const AllView = (todos) => {
    const container = document.createElement("div");
    container.classList.add("view-all");

    const tags = document.createElement("ul");
    tags.classList.add("tags");
    tags.textContent = "Tags:  ";
    let tagList = globalTags.get().sort();
    for (let tag of tagList) {
        let tagItem = document.createElement("li");
        let tagA = document.createElement("a");
        tagA.textContent = tag;
        tagItem.appendChild(tagA);
        tags.appendChild(tagItem);
    }
    const tagAll = document.createElement("li");
    const tagAAll = document.createElement("a");
    tagAAll.textContent = "VIEW ALL";
    tagAll.appendChild(tagAAll);
    tagAll.classList.add("VIEWALL");
    tags.appendChild(tagAll);

    const menu = document.createElement("menu");
    menu.classList.add("add-new");
    const addButton = document.createElement("button");
    addButton.textContent = "➕";
    const saveButton = document.createElement("button");
    saveButton.textContent = "💾"
    const importButton = document.createElement("button");
    importButton.textContent = "⤴️";

    for (let b of [addButton, saveButton, importButton]) {menu.appendChild(b)};

    const title = document.createElement("h1");
    title.textContent = "All Todos";

    const todoList = document.createElement("div");
    todoList.classList.add("todo-list");

    let todoDivs;
    if (!todos.length) {
        todoDivs = document.createElement("div");
        todoDivs.textContent = "Shouldn't you be working?"
        todoList.append(todoDivs);
    }
    else {
        todoDivs = todos.map(todo => {
            let todoDiv = document.createElement("div");
            todoDiv.id = todo.id;
            todoDiv.classList.add("todo-item");

            let todoP = document.createElement("p");
            let tit = todo.get("title");
            todoP.textContent = tit == "" ? "[untitled]" : tit

            let menu = document.createElement("menu");
            let completeButton = document.createElement("button");
            completeButton.textContent = todo.get("completed") ? "✅" : "✔️";

            let viewMoreButton = document.createElement("button");
            viewMoreButton.textContent = "🔍";

            let deleteButton = document.createElement("button");
            deleteButton.textContent = "❌"

            for (let b of [completeButton, viewMoreButton, deleteButton]) {menu.appendChild(b)};

            todoDiv.appendChild(todoP);
            todoDiv.appendChild(menu);

            todoList.appendChild(todoDiv);

            return {
                todo,
                div: todoDiv,
                text: todoP.textContent,
                menu: {
                    complete: completeButton,
                    view: viewMoreButton,
                    delete: deleteButton,
                }
            }
        })
    }

    for (let element of [title, tags, menu, todoList]) {
        container.appendChild(element);
    }
    
    return {
        container,
        title,
        tags,
        todoList,
        todoElements: todoDivs,
        menu : {
            add: addButton,
            save: saveButton,
            import: importButton,
            viewAll: tagAAll,
        },
        type: "view-all",
    }

}

const SingleView = (todo) => {
    const container = document.createElement("div");
    container.classList.add("view-single");

    const title = document.createElement("h1");
    let tit = todo.get("title");
    title.textContent = tit == "" ? "[untitled]" : tit;
    title.classList.add("title");

    const description = document.createElement("p");
    description.classList.add("description");
    let desc = todo.get("description");
    description.textContent = desc == "" ? "[no description]" : desc;

    const tags = document.createElement("ul");
    tags.classList.add("tags");
    tags.textContent = "Tags:  ";
    for (let tag of todo.get("tags")) {
        let tagItem = document.createElement("li");
        tagItem.textContent = tag;
        tags.appendChild(tagItem);
    }

    const priority = document.createElement("div");
    priority.classList.add("priority");

    const dueDate = document.createElement("p");
    dueDate.classList.add("due-date");
    dueDate.textContent = `Due: ${todo.get("dueDate").toISOString().slice(0,10)}`;
    const priorityLevel = document.createElement("p");
    priorityLevel.textContent = `Priority: ${todo.get("priority")}`;
    priority.appendChild(dueDate);
    priority.appendChild(priorityLevel);

    const metadata = document.createElement("div");
    metadata.classList.add("metadata");
    const metaCreated = document.createElement("p");
    metaCreated.classList.add("created");
    metaCreated.textContent = `Created: ${todo.get("created").toISOString().slice(0,10)}`
    const metaModified = document.createElement("p");
    metaModified.classList.add("modified");
    metaModified.textContent = `Last modified: ${todo.get("modified").toISOString().slice(0,10)}`;
    metadata.appendChild(metaCreated);
    metadata.appendChild(metaModified);

    const menu = document.createElement("menu");
    const completeButton = document.createElement("button");
    completeButton.textContent = todo.get("completed") ? "✅" : "✔️";

    const editButton = document.createElement("button");
    editButton.textContent = "✏️";

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "❌"

    const returnButton = document.createElement("button");
    returnButton.textContent = "⬆️";

    for (let b of [completeButton, editButton, deleteButton, returnButton]) {menu.appendChild(b)};

    for (let element of [title, description, priority, tags, menu, metadata]) {container.appendChild(element)};

    return {
        container,
        title,
        description,
        tags,
        priority,
        created: metaCreated,
        modified: metaModified,
        type: "view-single",
        menu: {
            edit: editButton,
            return: returnButton,
            complete: completeButton,
            delete: deleteButton,
        },
        todo,
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

    const tags = document.createElement("textarea");
    tags.id = "tags";
    tags.classList.add("tags");
    tags.value = todo.get("tagsAsString");

    const submitButton = document.createElement("button");
    submitButton.textContent = "💾";

    for (let element of [title, description, dueDate, priority, tags, submitButton]) {
        container.appendChild(element);
    }

    return {
        container,
        title,
        description,
        dueDate,
        priority,
        tags,
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

    const tags = document.createElement("textarea");
    tags.id = "tags";
    tags.classList.add("tags");

    const submitButton = document.createElement("button");
    submitButton.textContent = "💾";

    for (let element of [title, description, dueDate, priority, tags, submitButton]) {
        container.appendChild(element);
    }

    return {
        container,
        title,
        description,
        dueDate,
        priority,
        tags,
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
        if (view == "view-all" | view == "view-tag") {
            if (view == "view-tag") {
                currentView = AllView(library.getByTag(...args));
                currentView.title.textContent = `"${args}" Todos`
            }
            else {
                currentView = AllView(library.getAll());
            }
            currentView.menu.add.addEventListener("click", () => {
                setView("add-new");
            });
            currentView.menu.save.addEventListener("click", () => {
                library.setLocalStorage();
            });
            currentView.menu.import.addEventListener("click", () => {
                library.getLocalStorage();
                setView("view-all");
            })

            if (currentView.tags.children.length) {
                for (let tagLi of currentView.tags.children) {
                    let tagA = tagLi.querySelector("a");
                    if (tagLi.classList.contains("VIEWALL")) {
                        tagA.addEventListener("click", () => {
                            setView("view-all");
                        })
                    }
                    else (
                        tagA.addEventListener("click", () => {
                            setView("view-tag", tagA.textContent);
                        })
                    )
                }
            }
            if (Array.isArray(currentView.todoElements)) {
                for (let t of currentView.todoElements) {
                    t.menu.complete.addEventListener("click", () => {
                        t.toggleCompleted();
                        t.menu.complete.textContent = t.todo.get("completed") ? "✅" : "✔️";
                    });
                    t.menu.view.addEventListener("click", () => {
                        currentView = setView("view-single", t.todo.get("id"));
                    });
                    t.menu.delete.addEventListener("click", () => {
                        library.drop(t.todo.get("id"));
                        globalTags.update();
                        currentView = setView("view-all");
                    });
                }
            }
        }

        else if (view == "view-single") {
            currentView = SingleView(library.get(args));

            currentView.menu.complete.addEventListener("click", () => {
                currentView.todo.toggleCompleted();
                currentView.menu.complete.textContent = t.get("completed") ? "✅" : "✔️";
                currentView.modified.textContent = `Last modified: ${t.get("modified").toISOString().slice(0,10)}`;
            });
            currentView.menu.edit.addEventListener("click", () => {
                setView("edit", t.id);
            });
            currentView.menu.return.addEventListener("click", () => {
                setView("view-all");
            });
            currentView.menu.delete.addEventListener("click", () => {
                library.drop(t.id);
                globalTags.update();
                setView("view-all");
            })
        }

        else if (view == "edit") {
            currentView = EditView(library.get(args));
            currentView.submitButton.addEventListener("click", () => {
                let newTitle = currentView.title.value;
                let newDesc = currentView.description.value;
                let newDate = currentView.dueDate.value;
                let newPriority = currentView.priority.value;
                let newTags = currentView.tags.value;

                currentView.todo.functions.edit(newTitle, newDesc, newDate, newPriority, newTags);
                globalTags.update(library);

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
                let newTags = currentView.tags.value.split(",");

                library.add(Todo(newTitle, newDesc, newDate, undefined, undefined, undefined, newPriority, ...newTags));
                
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

    const todo1 = Todo("Lorem ipsum", "This is an example todo! Edit me with the pencil icon below.", "2022-08-01", undefined, undefined, undefined, undefined, "example");
/*     const todo2 = Todo("Loborbum ibipsub", "This is a second description", "2022-09-01", undefined, undefined, undefined, undefined, "gay", "extremely gay", "woah"); */

    library.add(todo1);

    const controller = Controller(library);
    controller.setView("view-all");
}

main();