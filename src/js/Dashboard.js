import Streams from './Streams';

class Dashboard {
    constructor(listTasks) {
        this.sttreams = new Streams();
        this._listTasks = listTasks.projects;
        this._listNameTasks = [];
        this.idProjectActive = null;
        this.listState = [];

        this._nodeWidgetStates = {};
        this._nodeWidgetTasks = {};
    }

    async init(nodeWidgetTasks, nodeWidgetStates) {
        this._nodeWidgetTasks =  document.querySelector(nodeWidgetTasks);
        this._nodeWidgetStates = document.querySelector(nodeWidgetStates);
        this.sttreams.subscribeClick();

        this._checkNameTasks();
        this._createProjectsList();
        this._renderState();
    }

    _checkNameTasks() {
        const namesTasks = new Set();
        const arr = [];

        for (const itemTask of this._listTasks) {
            if (!namesTasks.has(itemTask.id)) {
                namesTasks.add(itemTask.id);
            }
        }

        namesTasks.forEach(item => {
            arr.push(item)
        });

        this._listNameTasks = arr;
    }

    _createProjectsList() {
        const nameCategory = this._nodeWidgetTasks.querySelector('[data-tasks="name-category"]');
        const list = this._nodeWidgetTasks.querySelector('[data-tasks="list-categories"]');
        const listTasks = this._nodeWidgetTasks.querySelector('[data-tasks="list"]');

        nameCategory.addEventListener('click', (e) => {
            list.classList.toggle('dashboard__category-list--hidden');
        });

        nameCategory.innerHTML = '';
        list.innerHTML = '';
        listTasks.innerHTML = '';

        if (this.idProjectActive === null) {
            this.idProjectActive = this._listNameTasks[0];
        }

        this._listTasks.forEach(item => {
            const { tasks, name } = item;
            const category = document.createElement('li');
            category.className = 'dashboard__category-item';
            category.innerHTML = item.name;

            if (item.id === this.idProjectActive) {
                nameCategory.innerHTML = name;
                category.classList.add('dashboard__category-item--no-active');
                tasks.forEach(task => this._renderTasks(listTasks, task, tasks));
            } else {
                category.addEventListener('click', () => {
                    this.idProjectActive = item.id;
                    this._createProjectsList();
                });
                category.classList.add('dashboard__category-item--active');
            }

            list.appendChild(category);
        });
    }

    _renderTasks(list, task) {
        const check = document.createElement('button');
        check.className = 'dashboard__widget-check';

        check.addEventListener('click', e => this._clickCheckTask.call(this, e, task));

        if (task.done) check.classList.add('dashboard__widget-check--checked');

        const name = document.createElement('p');
        name.className = 'dashboard__widget-info';
        name.innerHTML = task.name;

        const item = document.createElement('li');
        item.className = 'dashboard__widget-item dashboard__tasks-item';
        item.appendChild(check);
        item.appendChild(name);

        list.appendChild(item);
    }

    _clickCheckTask(e, task) {
        e.currentTarget.classList.toggle('dashboard__widget-check--checked');
        task.done = !task.done;

        this.listState.forEach(item => {
            if (item.id === this.idProjectActive) {
                this.sttreams.click$.next(item);
            }
        });
    }

    _renderState () {
        const listStates = this._nodeWidgetStates.querySelector('[data-states="list"]');

        for (const state of this._listTasks) {
            this._createState(listStates, state);
        }
    }

    _createState(list, state){
        const { name, tasks, id } = state;

        const nameState = document.createElement('p');
        nameState.className = 'dashboard__widget-info';
        nameState.innerHTML = name;

        const quantity = document.createElement('div');
        quantity.className = 'dashboard__widget-quantity';
        quantity.innerHTML = tasks.filter(item => !item.done).length;

        this.listState.push({id, tasks, quantity});

        const item = document.createElement('li');
        item.className = 'dashboard__widget-item dashboard__states-item';
        item.appendChild(nameState);
        item.appendChild(quantity);

        list.appendChild(item)
    }
}

export default Dashboard;
