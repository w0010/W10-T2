const initialNodes = [
    {
        id: 'start',
        data: { html: 
            <div>
                <h4>Start</h4>
            </div> }, 
        position: { x: 0, y: 0 },
        type: 'start',
    },
    {
        id: 'ref',
        data: { html:
            <div>
                <h4>Reference</h4>
            </div> }, 
        position: { x: 150, y: 175 },
        type: 'wavy',
    },
    {
        id: 'con', 
        data: { html: 
            <div>
                <h4>Consultation</h4>
                <p>Goals and reference exchange.</p>
            </div> }, 
        position: { x: -100, y: 500 },
        type: 'basic',
    },
    {
        id: 'sil',
        data: { html: 
        <div>
            <h4>Silhouette</h4>
            <p>
                A ratio of darkness is decided, and raw compositions are explored over a photo or directly onto the body with a marker.
                The goal is to use very simple shapes to establish flow and to explore all possibilities.
                This is the equivalent of gesture drawing, the critical first step to an energetic finished work.
                It is rough, and raw.
            </p>
        </div> }, 
        position: { x: -300, y: 700 },
        type: 'basic',
    },
    {
        id: 'var1',
        data: { html: 
            <div>
                <h4>Variant 01</h4>
            </div> }, 
        position: { x: -250, y: 1050 },
        type: 'wavy',
    },
    {
        id: 'var2',
        data: { html: 
            <div>
                <h4>Variant 02</h4>
            </div> }, 
        position: { x: 0, y: 1050 },
        type: 'wavy',
    },
    {
        id: 'var3',
        data: { html: 
            <div>
               <h4>Variant 03</h4>
            </div> }, 
        position: { x: 250, y: 1050 },
        type: 'wavy',
    },
    {
        id: 'rA',
        data: { html: 
        <div>
            <h4>Render A</h4>
            <p>
                After finding a dominant flow, the design is brought to life either as a draft or a final design that can be tattooed/
                Precise drawing, pattern sampling, and value painting takes place here.
            </p>
        </div> }, 
        position: { x: -300, y: 1350 },
        type: 'basic',
    },
    {
        id: 'rAv1',
        data: { html: 
            <div>
               <h4>Variant 01</h4>
            </div> }, 
        position: { x: -150, y: 1600 },
        type: 'wavy',
    },
    {
        id: 'rAv2',
        data: { html: 
            <div>
               <h4>Variant 02</h4>
            </div> }, 
        position: { x: 150, y: 1600 },
        type: 'wavy',
    },
    {
        id: 'stn',
        data: { html: 
            <div>
               <h4>Stencil</h4>
            </div> }, 
        position: { x: -200, y: 2000 },
        type: 'wavy',
    },
    {
        id: 'fit',
        data: { html: 
        <div>
            <h4>Fitment</h4>
            <p>Design is brought to the skin to test for fitment and overall impression.</p>
        </div> }, 
        position: { x: 50, y: 2000 },
        type: 'basic',
    },
    {
        id: 'aprv',
        data: { html: 
            <div>
                <h4>Approve?</h4>
            </div> }, 
        position: { x: 0, y: 2200 },
        type: 'diamond',
    },
    {
        id: 'ana',
        data: { html: 
            <div>
                <h4>Anatomical map</h4>
                <p>
                    The design is simplified down to its basic structure with marker directly onto the body to create a kind of UV map.
                    This body map is copied to a flat surface and then digitized.
                    Mapping is a critical stage for meshins designs to morphically complex areas of the body, e.g. elbows, waist, and neck.
                </p>
            </div> }, 
        position: { x: -300, y: 2500 },
        type: 'basic',
    },
    {
        id: 'map',
        data: { html: 
            <div>
               <h4>Map</h4>
            </div> }, 
        position: { x: 0, y: 2800 },
        type: 'wavy',
    },
    {
        id: 'rBf',
        data: { html: 
            <div>
               <h4>Render-B final</h4>
            </div> }, 
        position: { x: -150, y: 3000 },
        type: 'wavy',
    },
    {
        id: 'rB',
        data: { html: 
            <div>
                <h4>Render B</h4>
                <p>
                    Precise drawing, pattern sampling, and value painting take palce again but to the specific flow of the client's body map rather than a two-dimensional photo of the body part.
                    The design will appear too wide and distorted, due to the flattening of cylindrical body. This technique allows high control, producing a very tight fit.
                </p>
            </div> }, 
        position: { x: -300, y: 3400 },
        type: 'basic',
    },
    {
        id: 'tattoo',
        data: { html: 
            <div>
                <h4>Tattoo</h4>
            </div> }, 
        position: { x: 0, y: 4000 },
        type: 'end',
    },
];

export default nodes;