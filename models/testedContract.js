const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const testedContractSchema = new Schema({
    smartContract: {
        ref: 'smartcontracts',
        type: Schema.Types.ObjectId
    },
    user: {
        ref: 'users',
        type: Schema.Types.ObjectId
    },
    testCompilations:[{
        ref: 'testcompiledcontracts',
        type: Schema.Types.ObjectId
    }],

}, {
    timestamps: true
});

const TestedContract = mongoose.model('testedcontracts', testedContractSchema);

export default TestedContract;
