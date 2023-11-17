// Edges.js
const edges = [
    {id: 's-c', source: 'start', target: 'con', type: 'CustomEdge', animated: true},
    {id: 'r-c', source: 'ref', target: 'con', type: 'CustomEdge'},
    {id: 'c-s', source: 'con', target: 'sil', type: 'CustomEdge', animated: true},
    {id: 's-1', source: 'sil', target: 'var1', type: 'CustomEdge'},
    {id: 's-2', source: 'sil', target: 'var2', type: 'CustomEdge'},
    {id: 's-3', source: 'sil', target: 'var3', type: 'CustomEdge'},
    {id: 's-r', source: 'var3', target: 'rA', type: 'CustomEdge', data: { label: 'chosen variant' }, animated: true},
    {id: 'r-1', source: 'rA', target: 'rAv1', type: 'CustomEdge'},
    {id: 'r-2', source: 'rA', target: 'rAv2', type: 'CustomEdge'},
    {id: 'r-s', source: 'rAv2', target: 'stn', type: 'CustomEdge', data: { label: 'chosen variant' }, animated: true},
    {id: 's-a', source: 'stn', target: 'aprv', type: 'CustomEdge', animated: true},
    {id: 'f-s', source: 'fit', target: 'stn', type: 'CustomEdge'},
    {id: 'a-t', source: 'aprv', target: 'tattoo', type: 'CustomEdge', data: { label: 'yes' }, animated: true},
    {id: 'a-a', source: 'aprv', target: 'ana', type: 'CustomEdge', data: { label: 'no' }, animated: true},
    {id: 'a-m', source: 'ana', target: 'map', type: 'CustomEdge'},
    {id: 'm-r', source: 'map', target: 'rBf', type: 'CustomEdge', animated: true},
    {id: 'r-r', source: 'rBf', target: 'rB', type: 'CustomEdge'},
    {id: 'r-t', source: 'rB', target: 'stn', type: 'CustomEdge', animated: true},
];

export default edges;