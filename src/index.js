import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route, NavLink, Redirect } from 'react-router-dom';

import './index.styl';
import Preloader from './preloader.svg';


class App extends React.Component {
    state = {
        tabs: null,
        tabComponents: {}
    }

    componentDidMount() {
        fetch('https://api.myjson.com/bins/1b06kn')
            .then(response => response.json())
            .then(data => {
                this.setState({
                    tabs: data.sort((a, b) => a.order - b.order)
                });
            });
    }

    async loadComponent(path) {
        const component = await import(`./tabs/${path}`);

        this.setState({
            tabComponents: {
                ...this.state.tabComponents,
                [path]: component.default
            }
        });
    }

    renderActiveTab = props => {
        const path = props.match.path.slice(baseRoute.length);
        const ActiveComponent = this.state.tabComponents[path];

        if (!ActiveComponent) {
            this.loadComponent(path);
            return <Preloader className='preloader' />;
        }

        return <ActiveComponent />;
    }

    renderLink = tab => {
        return (
            <li key={tab.id} className='tabs__nav-item'>
                <NavLink
                    to={`${baseRoute}${tab.id}`}
                    className='tabs__nav-link'
                    activeClassName='tabs__nav-link_active'
                >{tab.title}</NavLink>
            </li>
        );
    }

    renderRoute = tab => (
        <Route key={tab.id} path={`${baseRoute}${tab.id}`} render={this.renderActiveTab} />
    )

    render() {
        const { tabs } = this.state;

        return (
            <BrowserRouter>
                { tabs ? (
                    <div className='tabs'>
                        <nav className='tabs__nav'>
                            <ul className='tabs__nav-list'>
                                {tabs.map(this.renderLink)}
                            </ul>
                        </nav>
                        <div className='tabs__content'>
                            <Switch>
                                {tabs.map(this.renderRoute)}
                                <Redirect from={`${baseRoute}`} to={`${baseRoute}${tabs[0].id}`} />
                            </Switch>
                        </div>
                    </div>
                ) : <Preloader className='preloader' /> }
            </BrowserRouter>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('app'));
