const { log } = require('console');
const frisby = require('frisby');

const job = { 
    id: 3, 
    name: 'Mobile Developer' 
};
it('Create Job', function () {
    return frisby.post('http://localhost:3000/jobs',job)
        .expect('status', 200)
        .expect('json', 'id', job.id)
        .expect('json', 'name', job.name);
});

it('Create Job Invalid Id', function () {
    return frisby.post('http://localhost:3000/jobs',job)
        .expect('status', 400)
        .expect('json', 'error', 'id already exists');
});

it('Get Jobs', function () {
    return frisby.get('http://localhost:3000/jobs')
        .expect('status', 200).then(function (res) {
            console.log(res.json);
            expect(res.json.data.length).toBe(3);
        });
});