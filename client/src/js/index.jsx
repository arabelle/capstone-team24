import React from 'react';
import { render } from 'react-dom';
import { Header } from './app.jsx';
import { EventsList, MainEvent } from './events.jsx';

render(<div>
    <Header />
    <MainEvent />
    <EventsList />
</div>, document.getElementById('app'));