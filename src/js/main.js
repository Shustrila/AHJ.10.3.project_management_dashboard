import api from './api';
import Dashboard from './Dashboard';

const dashboard = new Dashboard(api);

dashboard.init(
    '[data-widget="tasks"]',
    '[data-widget="states"]'
);
