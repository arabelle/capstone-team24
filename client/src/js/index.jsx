import React from 'react';
import { render } from 'react-dom';
import { Header } from './app.jsx';
import { EventsList, MainEvent } from './events.jsx';
import {CrawlerButton} from './crawler.jsx';

render(<div>
    <Header />
    <CrawlerButton />
    <MainEvent />
    <EventsList />
</div>, document.getElementById('app'));
