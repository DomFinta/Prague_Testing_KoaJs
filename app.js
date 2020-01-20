const Koa = require('koa');
const KoaRouter = require('koa-router');
const json = require('koa-json');
const path = require('path');
const render = require('koa-ejs'); 
const bodyParser = require('koa-bodyparser');
const mongoose = require('mongoose');
const Property = require('./models/Task.js');

const app = new Koa();
const router = new KoaRouter();

//DB connection
mongoose.connect(
    'mongodb://localhost/koajstest'
);

app.use(json());

app.use(bodyParser());

render(app, {
    root: path.join(__dirname, 'views'),
    layout: 'layout',
    viewExt: 'html'
});

router.get('/', index);
router.get('/add', add);
router.post('/api/leads', addControl);
router.get('/api/leads', showDB);

// Index
async function index(ctx) {
    await ctx.render('index');
}

// Add
async function add(ctx) {
    await ctx.render('add');
}

// Show
async function showDB(ctx) {
    await Property.find()
        .then(propertyes => {
            ctx.body = propertyes
        })
        .catch(err => {
            ctx.body = 'error: ' + err;
        });
}

// Control adding into DB
async function addControl(ctx) {
    const body = ctx.request.body;
    
    if(!(body.type === 'a')) {
        //error
        ctx.throw(400, 'Wrong form');
    }

    if(!body.district) {
        //error
        ctx.throw(400, 'Empty district');
    }

    if(!body.property) {
        ctx.throw(400, 'Empty property');
    } else {
        if(!(body.property === "HOUSE" || body.property === "FLAT" || body.property === "COMMERCIAL_OBJECT" || body.property === "OTHER")) {
            //error
            ctx.throw(400, 'Wrong property');
        }
    }

    if(!body.fullName) {
        //error
        ctx.throw(400, 'Empty name');
    }

    if(!body.email) {
        //error
        ctx.throw(400, 'Empty email');
    } else {
        if(!ValidEmail(body.email)) {
            //error
            ctx.throw(400, 'Invalid email');
        }
    }

    if(!body.phone) {
        //error
        ctx.throw(400, 'Empty phone');
    } else {
        if(!ValidPhone(body.phone)) {
            //error
            ctx.throw(400, 'Invalid phone');
        } 
    }

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();

    today = dd + '.' + mm + '.' + yyyy;

    var property = new Property();
    property.type = body.type;
    property.district = body.district;
    property.propertyType = body.property;
    property.fullName = body.fullName;
    property.email = body.email;
    property.phoneNumber = body.phone;
    property.createdAt = today;

    await property.save()
        .catch(err => {
            ctx.body = 'Error: ' + err;
        })

    ctx.redirect('/');

}

app.use(router.routes()).use(router.allowedMethods());

app.listen(5000);

function ValidEmail(mail) 
{
 if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
  {
    return (true)
  }
    return (false)
}

function ValidPhone(number) 
{
 if (/^[0-9]{9}$/.test(number))
  {
    return (true)
  }
    return (false)
}