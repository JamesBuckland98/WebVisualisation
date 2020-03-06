import { FunctionalComponent, h } from 'preact';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

import { chartData } from 'data';

const BurnDown: FunctionalComponent = () => {
    return (
        <LineChart width={1200} height={300} data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
            <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
            <XAxis dataKey="date" />
            <YAxis dataKey="value" />
            <Tooltip />
        </LineChart>
    );
};

export default BurnDown;
