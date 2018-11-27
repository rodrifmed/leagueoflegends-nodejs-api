
import 'mocha';
import app from '../server/server';

let chai = require('chai');
let chaiHttp = require('chai-http');

let should = chai.should();

chai.use(chaiHttp);

describe('/GET matches:name', () => {
    it('it should GET matches from a summoner', (done) => {
        chai.request(app)
            .get('/api/matches/RabiscoSP')
            .end((err, res) => {

                res.should.have.status(200);
                res.body.should.be.a('object');

                let payload = res.body.payload;

                payload.should.be.a('object');

                let summonerInfo = payload.summonerInfo;

                summonerInfo.should.have.property('id');
                summonerInfo.should.have.property('name');
                summonerInfo.should.have.property('accountId');
                summonerInfo.should.have.property('profileIconId');
                summonerInfo.should.have.property('revisionDate');
                summonerInfo.should.have.property('summonerLevel');
                summonerInfo.should.have.property('accountId').eq(216122194);

                let matches = payload.matches;

                matches.should.be.a('array');

                matches.forEach(matchs => {
                    matchs.should.have.property('accountId')
                    matchs.should.have.property('gameId')
                    matchs.should.have.property('outcome')
                    matchs.should.have.property('championName')
                    matchs.should.have.property('gameDuration')
                    matchs.should.have.property('kda')
                    matchs.should.have.property('summonerName')
                    matchs.should.have.property('summonerSpells')
                    matchs.should.have.property('summonerRunes')
                    matchs.should.have.property('items')
                    matchs.should.have.property('championLevel')
                });

                done();
            });
    });
});