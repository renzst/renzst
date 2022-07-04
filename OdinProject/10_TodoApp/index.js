// Todo app
// Renz Torres, Odin Project

const fs = require('fs');
const path = require('path');


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

const Todo = (content, modified = Date.now(), created = Date.now(), completed = false, ...tags) => {
    let id = ID.get();
    content = content.slice(0, 140);
    let tagLibrary = TagLibrary(...tags);

    const modify = () => {
        modified = Date.now();
    }

    const get = () => {
        return {
            id,
            content,
            tags: tagLibrary.get(),
            created,
            modified,
            completed
        }
    };

    const edit = (newContent) => {
        modify();
        content = newContent;
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

    const exportToJSON = (filePath = ".", name_ = "todo.json") => {
        let exportData = getAll(info = true);
        for (let d of exportData) {
            d.tags = [...d.tags];
        }

        exportData = JSON.stringify(exportData);


        if (fs.existsSync(filePath)) {
            fs.writeFileSync(path.join(filePath, name_), exportData);
        }
    }

    const importFromJSON = (file) => {
        let data = fs.readFileSync(file, "utf-8");
        data = JSON.parse(data);

        for (let obj of data) {
            if (!("content" in obj)) {continue;} // i.e. not a valid todo obj
            if (!("created" in obj)) {obj.created = Date.now();}
            if (!("modified" in obj)) {obj.modified = Date.now();}
            if (!("completed" in obj)) {obj.completed = false;}
            let newTodo = Todo(obj.content, obj.modified, obj.created, obj.completed, ...obj.tags);
            console.log(newTodo);
            add(newTodo);
        }

    }

    return {
        count,
        getAll,
        get,
        getByTag,
        add,
        drop,
        exportToJSON,
        importFromJSON
    }
}

const main = () => {
    let library = Library();

    let todo = Todo("Lorem ipsub", undefined, undefined, undefined, "gay", "really gay");
    library.add(todo);

    library.exportToJSON();
    console.log(library.getAll(info = true));

    library.importFromJSON("todo.json");

    console.log(library.getAll(info = true));
}

main();