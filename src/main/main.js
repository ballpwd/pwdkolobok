import * as waxjs from "@waxio/waxjs/dist";

const wax = new waxjs.WaxJS('https://wax.greymass.com', null, null, false);



//checks if autologin is available 
export const autoLogin = async ()=> {
    let isAutoLoginAvailable = await wax.isAutoLoginAvailable();
    if (isAutoLoginAvailable) {
        let userAccount = wax.userAccount;
        let pubKeys = wax.pubKeys;
        let str = 'AutoLogin enabled for account: ' + userAccount;
        document.getElementById('autologin').textContent =  str;
        document.getElementById('loginbtn').style.display = 'none';
    }
    else {
        console.log('Not auto-logged in')
    }
}


//normal login. Triggers a popup for non-whitelisted dapps
export const login = async ()=> {
    try {
        //if autologged in, this simply returns the userAccount w/no popup
        let userAccount = await wax.login();
        let pubKeys = wax.pubKeys;
        let str = 'Account: ' + userAccount
        document.getElementById('loginresponse').textContent =  str;
        document.getElementById('autologin').style.display = 'none';
        document.getElementById('loginbtn').style.display = 'none';
    } catch (e) {
        console.log(e.message);
    }
} 

export const sign = async ()=> {
    if(!wax.api) {
        document.getElementById('autologin').textContent = '* Login first *';
        return
    }
    // var kolo_id = document.getElementById('koloid').value;
    // var kolo_name = document.getElementById('name').value;
    var kolo_id = 100000009144017
    var kolo_name = 'SP 246 Speed 246'
    try {
        const result = await wax.api.transact({

        actions: [{
            account: 'ilovekolobok',
            name: 'rename',
            authorization: [{
                actor: wax.userAccount,
                permission: 'active',
                }],
            data: {
                owner: wax.userAccount,
                assetid: kolo_id,
                name: kolo_name,
                memo: ''
                },            
            }]
        }, {
        blocksBehind: 3,
        expireSeconds: 30
        });

        let trx_id = result['transaction_id'];
        console.log('Done! Transaction # ' + trx_id)

    } catch(e) {
        console.log(e)
    }
}


// export const getAvailableItems = async ()=> {
//     if(!wax.api) {
//         alert('Login first!')
//         console.log('Login first!')
//     }
//     const result = []
//     let next = ''
//     let more = true 
//     while(more){
//         let data = await wax.rpc.get_table_rows({  
//             json: true,
//             code:  'simpleassets',
//             scope: wax.userAccount,
//             table: 'sassets',
//             table_key: 'id',
//             lower_bound: (next ? next : 0),
//             upper_bound: '-1',
//             index_position: 1,
//             key_type: "i64",
//             limit: 1000,
//             reverse: false,
//             show_payer: false
//         })
//         let rows = data.rows
//         more = data.more
//         next = data.next_key
//         result.push(...rows)
//     }
//     console.log(result)
// }

// export const getClaimItems = async ()=> {
//     const result = await  wax.rpc.get_table_rows({  
//         json: true,
//         code:  'simpleassets',
//         scope: 'simpleassets',
//         table: 'offers',
//         table_key: 'offeredto',
//         index_position: 3,
//         key_type: "i64",
//         lower_bound: wax.userAccount,
//         upper_bound: wax.userAccount + 'a',
//         limit: 1000
//     });
//     console.log(result)
// }

// export const getBabiesTable = async ()=>{
//     const result = await wax.rpc.get_table_rows({  
//         json: true,
//         code:  'ilovekolobok',
//         scope: 'ilovekolobok',
//         table: 'babys',
//         table_key: 'owner',
//         index_position: 2,
//         key_type: "i64",
//         lower_bound: wax.userAccount,
//         upper_bound: wax.userAccount + 'a',
//         limit: 10000
//     });
//     console.log(result)
// }

// export const getAssetById = async (id, owner) => {
//     let asset = await wax.rpc.get_table_rows({  
//         json: true,
//         code:  'simpleassets',
//         scope: owner,
//         table: 'sassets',
//         table_key: 'id',
//         lower_bound: `${id}`,
//         upper_bound: `${id}`,
//         limit: 1 
//     });

//     return asset;
// }






const createProductStructure = (elem) => {
    if (!elem){
       return;
    }
    try {
       elem.idata = JSON.parse(elem.idata);
       elem.mdata = JSON.parse(elem.mdata);
    } catch (e) {
       console.log(e);
    }
    elem.info = {};
    generateInfo(elem.mdata, elem.info);
    generateInfo(elem.idata, elem.info);
    // return {
    //       id: elem.id || elem.assetId,
    //       name: (elem.info) ? elem.info.name : '',
    //       image: (elem.info) ? elem.info.img : '',
    //       category: elem.category,
    //       type: elem.category,
    //       idata: elem.idata,
    //       mdata: elem.mdata,
    //       description: (elem.info) ? elem.info.desc : '',
    //       author: elem.author,
    //       owner: elem.owner,
    // };
    let result = {} ;
    if(elem.category == 'kolobok'){
        result = {
            id: elem.id || elem.assetId,
            name: (elem.info) ? elem.info.name : '',
            image: (elem.info) ? elem.info.img : '',
            category: elem.category,
            gen: elem.idata.gen,
            genome: elem.idata.genome,
            bdate: elem.idata.bdate,
            pe: (elem.mdata.pe) ? elem.mdata.pe : '00000',
            speed: calcSpeed(elem.idata.genome),
            stealth: calcStealth(elem.idata.genome),
            st: elem.mdata.st,
            health: elem.mdata.health,
            kids: elem.mdata.kids,
            cd: elem.mdata.cd
        }
    }else if(elem.category == 'prize'){
        result = {
            id: elem.id || elem.assetId,
            name: (elem.info) ? elem.info.name : '',
            image: (elem.info) ? elem.info.img : '',
            category: elem.category,
            class: elem.idata.class,
            prize_date: elem.idata.prize_date,
        }
    }
    return result

}

const generateInfo = (obj, info) => {
    Object.keys(obj).forEach(key => {
        if (key === 'name') {
           info['name'] = obj.name;
        }
        if (key === 'desc') {
           info['desc'] = obj.desc;
        }
        if (key === 'img') {
           info['img'] = obj.img;
        }
    });
}

const calcSpeed = (genome) => {
    const t = genome.length;
    const n = genome.length / 2;
    const l = [genome.slice(0, 2), genome.slice(t - 2, t)];
    const r = [genome.slice(n - 2, n), genome.slice(n, n + 2)];

    let speed = Math.abs(parseInt(l[0], 16) - parseInt(l[1], 16));

    return speed
} 

const calcStealth = (genome) => {
    const t = genome.length;
    const n = genome.length / 2;
    const l = [genome.slice(0, 2), genome.slice(t - 2, t)];
    const r = [genome.slice(n - 2, n), genome.slice(n, n + 2)];

    let stealth = ((255 - Math.abs(parseInt(r[0], 16) - parseInt(r[1], 16))) / 255).toFixed(2);

    return stealth
} 








// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------

export const getall = async ()=> {
    if(!wax.api) {
        alert('Login first!')
        console.log('Login first!')
    }
    let result = []
    let next = ''
    let more = true 
    while(more){
        let data = await wax.rpc.get_table_rows({  
            json: true,
            code:  'simpleassets',
            scope: wax.userAccount,
            table: 'sassets',
            table_key: 'id',
            lower_bound: (next ? next : 0),
            upper_bound: '-1',
            index_position: 1,
            key_type: "i64",
            limit: 1000,
            reverse: false,
            show_payer: false
        })
        let rows = data.rows
        more = data.more
        next = data.next_key
        result.push(...rows.map(elem => {
            return createProductStructure(elem);
        })) 
    }

    console.log(result)
}


export const getavailable = async ()=> {
    if(!wax.api) {
        alert('Login first!')
        console.log('Login first!')
    }
    let result = []
    let next = ''
    let more = true 
    while(more){
        let data = await wax.rpc.get_table_rows({  
            json: true,
            code:  'simpleassets',
            scope: wax.userAccount,
            table: 'sassets',
            table_key: 'id',
            lower_bound: (next ? next : 0),
            upper_bound: '-1',
            index_position: 1,
            key_type: "i64",
            limit: 1000,
            reverse: false,
            show_payer: false
        })
        let rows = data.rows
        more = data.more
        next = data.next_key
        result.push(...rows.filter(elem =>{return elem.category == 'kolobok'}).map(elem => {
            return createProductStructure(elem);
        })) 
    }
    let date = +new Date()
    result = result.filter(elem=>{return elem.health == 100 && elem.cd *1000 < date })
    console.log(result)
    
    return result
}



export const breeding = async (items,name)=> {
    if(!wax.api) {
        alert('Login first!')
        console.log('Login first!')
    }
    try {
        const result = await wax.api.transact({
        actions: [{
            account: 'ilovekolobok',
            name: 'breed',
            authorization: [{
                actor: wax.userAccount,
                permission: 'active',
                }],
            data: {
                owner: wax.userAccount,
                parent1: items[0],
                parent2: items[1],
                name: name
            }            
        }]
        }, {
        blocksBehind: 3,
        expireSeconds: 30
        });
        
        let trx_id = result['transaction_id'];
        console.log('Done! Transaction # ' + trx_id)
    } catch(e) {
        console.log(e)
    }
}

export const adventure = async (item,slot)=> {
    if(!wax.api) {
        alert('Login first!')
        console.log('Login first!')
    }
    try {
        const result = await wax.api.transact({
        actions: [{
            account: 'simpleassets',
            name: 'transfer',
            authorization: [{
                actor: wax.userAccount,
                permission: 'active',
                }],
            data: {
                from: wax.userAccount,
                to: 'ilovekolobok',
                assetids: item,
                memo: 'sendto:'+slot,
            },            
        }]
        }, {
        blocksBehind: 3,
        expireSeconds: 30
        });
        
        let trx_id = result['transaction_id'];
        console.log('Done! Transaction # ' + trx_id)
    } catch(e) {
        console.log(e)
    }
}

export const closealladventure = async ()=> {
    if(!wax.api) {
        alert('Login first!')
        console.log('Login first!')
    }
    try {
        const result = await wax.api.transact({
        actions: [{
            account: 'ilovekolobok',
            name: 'closealladv',
            authorization: [{
                actor: wax.userAccount,
                permission: 'active',
                }],
            data: {
                owner: wax.userAccount
            }         
        }]
        }, {
        blocksBehind: 3,
        expireSeconds: 30
        });
        
        let trx_id = result['transaction_id'];
        console.log('Done! Transaction # ' + trx_id)
    } catch(e) {
        console.log(e)
    }
}

export const prizesent = async ()=> {
    if(!wax.api) {
        alert('Login first!')
        console.log('Login first!')
    }
    try {
        let prizes = []
        let next = ''
        let more = true 
        while(more){
            let data = await wax.rpc.get_table_rows({  
                json: true,
                code:  'simpleassets',
                scope: wax.userAccount,
                table: 'sassets',
                table_key: 'id',
                lower_bound: (next ? next : 0),
                upper_bound: '-1',
                index_position: 1,
                key_type: "i64",
                limit: 1000,
                reverse: false,
                show_payer: false
            })
            let rows = data.rows
            more = data.more
            next = data.next_key
            prizes.push(...rows.filter(elem =>{return elem.category == 'prize'}).map(elem => {
                return createProductStructure(elem);
            })) 
        }
        prizes = prizes.map(elem => {return elem.id})
        
        console.log(prizes)

        const result = await wax.api.transact({
        actions: [{
            account: 'simpleassets',
            name: 'transfer',
            authorization: [{
                actor: wax.userAccount,
                permission: 'active',
                }],
            data: {
                from: wax.userAccount,
                to: 'q3b.o.wam',
                assetids: prizes,
                memo: '',
            },            
        }]
        }, {
        blocksBehind: 3,
        expireSeconds: 30
        });
        
        let trx_id = result['transaction_id'];
        console.log('Done! Transaction # ' + trx_id)

    } catch(e) {
        console.log(e)
    }
}



export const letclaim = async ()=> {
    if(!wax.api) {
        alert('Login first!')
        console.log('Login first!')
    }
    try {
        // let result = []
        // let next = ''
        // let more = true 
        // while(more){
        //     let data = await wax.rpc.get_table_rows({  
        //         code:  'simpleassets',
        //         index_position: 3,
        //         json: true,
        //         key_type: "i64",
        //         limit: 1000,
        //         lower_bound: wax.userAccount,
        //         reverse: false,
        //         scope: 'simpleassets',
        //         show_payer: false,
        //         table: 'offers',
        //         table_key: 'offeredto',
        //         upper_bound: wax.userAccount+'a'
        //     })
        //     let rows = data.rows
        //     more = data.more
        //     next = data.next_key
        //     result.push(...rows.filter(elem =>{return elem.category == 'kolobok'}).map(elem => {
        //         return createProductStructure(elem);
        //     })) 
        // }

        let claimlist = []
        let data = await wax.rpc.get_table_rows({  
            code:  'simpleassets',
            index_position: 3,
            json: true,
            key_type: "i64",
            limit: 300,
            lower_bound: wax.userAccount,
            reverse: false,
            scope: 'simpleassets',
            show_payer: false,
            table: 'offers',
            table_key: 'offeredto',
            upper_bound: wax.userAccount+'a'
        })
        let rows = data.rows

        claimlist.push(...rows) 
        
        claimlist = claimlist.map(elem => {return elem.assetid})

        console.log(claimlist)

        const result = await wax.api.transact({
            actions: [{
                account: 'simpleassets',
                name: 'claim',
                authorization: [{
                    actor: wax.userAccount,
                    permission: 'active',
                    }],
                data: {
                    claimer: wax.userAccount,
                    assetids: claimlist,
                },            
            }]
            }, {
            blocksBehind: 3,
            expireSeconds: 30
            });
            
            let trx_id = result['transaction_id'];
            console.log('Done! Transaction # ' + trx_id)

    } catch(e) {
        console.log(e)
    }

}


export const sellexperienced = async ()=> {
    if(!wax.api) {
        alert('Login first!')
        console.log('Login first!')
    }
    try {
        const result = []
        let next = ''
        let more = true 
        while(more){
            let data = await wax.rpc.get_table_rows({  
                json: true,
                code:  'simpleassets',
                scope: wax.userAccount,
                table: 'sassets',
                table_key: 'id',
                lower_bound: (next ? next : 0),
                upper_bound: '-1',
                index_position: 1,
                key_type: "i64",
                limit: 1000,
                reverse: false,
                show_payer: false
            })
            let rows = data.rows
            more = data.more
            next = data.next_key
            result.push(...rows.filter(elem =>{return elem.category == 'kolobok'}).map(elem => {
                return createProductStructure(elem);
            })) 
        }
        console.log(result)
    
        let fil = result.filter(elem =>{return item.pe[3] == '1' && item.pe[4] == '1' })
    
        let kololist = fil.map(elem => {return elem.id})
        
        console.log(kololist)

        const transact = await wax.api.transact({
        actions: [{
            account: 'simpleassets',
            name: 'transfer',
            authorization: [{
                actor: wax.userAccount,
                permission: 'active',
                }],
            data: {
                from: wax.userAccount,
                to: 'simplemarket',
                assetids: kololist,
                memo: '{"price":"0.01000000 WAX"}',
            },            
        }]
        }, {
        blocksBehind: 3,
        expireSeconds: 30
        });
        
        let trx_id = transact['transaction_id'];
        console.log('Done! Transaction # ' + trx_id)

    } catch(e) {
        console.log(e)
    }

}









// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------



export const getbelow242 = async ()=> {
    if(!wax.api) {
        alert('Login first!')
        console.log('Login first!')
    }
    const result = []
    let next = ''
    let more = true 
    while(more){
        let data = await wax.rpc.get_table_rows({  
            json: true,
            code:  'simpleassets',
            scope: wax.userAccount,
            table: 'sassets',
            table_key: 'id',
            lower_bound: (next ? next : 0),
            upper_bound: '-1',
            index_position: 1,
            key_type: "i64",
            limit: 1000,
            reverse: false,
            show_payer: false
        })
        let rows = data.rows
        more = data.more
        next = data.next_key
        result.push(...rows.filter(elem =>{return elem.category == 'kolobok'}).map(elem => {
            return createProductStructure(elem);
        })) 
    }
    console.log(result)

    // let fil = result.filter(elem =>{return elem.health == 100 && elem.speed == 246 && elem.st == 3 && elem.kids == 0 && elem.gen > 26 && elem.stealth < 0.90 })
    let fil = result.filter(elem =>{return elem.health == 100 && elem.speed < 242 })
    // let fil = result.filter(elem =>{return elem.health == 100 && elem.speed > 245 })

    
    let want = fil.map(elem => {return elem.id})
    console.log(fil)
    console.log(want)
}

export const getbelow246 = async ()=> {
    if(!wax.api) {
        alert('Login first!')
        console.log('Login first!')
    }
    const result = []
    let next = ''
    let more = true 
    while(more){
        let data = await wax.rpc.get_table_rows({  
            json: true,
            code:  'simpleassets',
            scope: wax.userAccount,
            table: 'sassets',
            table_key: 'id',
            lower_bound: (next ? next : 0),
            upper_bound: '-1',
            index_position: 1,
            key_type: "i64",
            limit: 1000,
            reverse: false,
            show_payer: false
        })
        let rows = data.rows
        more = data.more
        next = data.next_key
        result.push(...rows.filter(elem =>{return elem.category == 'kolobok'}).map(elem => {
            return createProductStructure(elem);
        })) 
    }
    console.log(result)


    let fil = result.filter(elem =>{return elem.health == 100 && elem.speed < 246 && elem.stealth < 1 })

    
    let want = fil.map(elem => {return elem.id})
    console.log(fil)
    console.log(want)
}


export const get242 = async ()=> {
    if(!wax.api) {
        alert('Login first!')
        console.log('Login first!')
    }
    const result = []
    let next = ''
    let more = true 
    while(more){
        let data = await wax.rpc.get_table_rows({  
            json: true,
            code:  'simpleassets',
            scope: wax.userAccount,
            table: 'sassets',
            table_key: 'id',
            lower_bound: (next ? next : 0),
            upper_bound: '-1',
            index_position: 1,
            key_type: "i64",
            limit: 1000,
            reverse: false,
            show_payer: false
        })
        let rows = data.rows
        more = data.more
        next = data.next_key
        result.push(...rows.filter(elem =>{return elem.category == 'kolobok'}).map(elem => {
            return createProductStructure(elem);
        })) 
    }
    console.log(result)

    let fil = result.filter(elem =>{return elem.health == 100 && elem.speed == 242 && elem.st == 2 && elem.kids > 0 && elem.stealth < 1 && elem.cd *1000 > +new Date()})

    let want = fil.map(elem => {return elem.id})
    console.log(fil)
    console.log(want)
}

export const get242kid0 = async ()=> {
    if(!wax.api) {
        alert('Login first!')
        console.log('Login first!')
    }
    const result = []
    let next = ''
    let more = true 
    while(more){
        let data = await wax.rpc.get_table_rows({  
            json: true,
            code:  'simpleassets',
            scope: wax.userAccount,
            table: 'sassets',
            table_key: 'id',
            lower_bound: (next ? next : 0),
            upper_bound: '-1',
            index_position: 1,
            key_type: "i64",
            limit: 1000,
            reverse: false,
            show_payer: false
        })
        let rows = data.rows
        more = data.more
        next = data.next_key
        result.push(...rows.filter(elem =>{return elem.category == 'kolobok'}).map(elem => {
            return createProductStructure(elem);
        })) 
    }
    console.log(result)

    let fil = result.filter(elem =>{return elem.health == 100 && elem.speed == 242 && elem.st == 3 && elem.kids == 0 && elem.stealth < 1 && elem.cd *1000 > +new Date()})

    let want = fil.map(elem => {return elem.id})
    console.log(fil)
    console.log(want)
}

export const get246 = async ()=> {
    if(!wax.api) {
        alert('Login first!')
        console.log('Login first!')
    }
    const result = []
    let next = ''
    let more = true 
    while(more){
        let data = await wax.rpc.get_table_rows({  
            json: true,
            code:  'simpleassets',
            scope: wax.userAccount,
            table: 'sassets',
            table_key: 'id',
            lower_bound: (next ? next : 0),
            upper_bound: '-1',
            index_position: 1,
            key_type: "i64",
            limit: 1000,
            reverse: false,
            show_payer: false
        })
        let rows = data.rows
        more = data.more
        next = data.next_key
        result.push(...rows.filter(elem =>{return elem.category == 'kolobok'}).map(elem => {
            return createProductStructure(elem);
        })) 
    }
    console.log(result)

    let fil = result.filter(elem =>{return elem.health == 100 && elem.speed == 246 && elem.st == 2 && elem.kids > 0 && elem.stealth < 1 && elem.cd *1000 > +new Date()})

    let want = fil.map(elem => {return elem.id})
    console.log(fil)
    console.log(want)
}

export const get246kid0 = async ()=> {
    if(!wax.api) {
        alert('Login first!')
        console.log('Login first!')
    }
    const result = []
    let next = ''
    let more = true 
    while(more){
        let data = await wax.rpc.get_table_rows({  
            json: true,
            code:  'simpleassets',
            scope: wax.userAccount,
            table: 'sassets',
            table_key: 'id',
            lower_bound: (next ? next : 0),
            upper_bound: '-1',
            index_position: 1,
            key_type: "i64",
            limit: 1000,
            reverse: false,
            show_payer: false
        })
        let rows = data.rows
        more = data.more
        next = data.next_key
        result.push(...rows.filter(elem =>{return elem.category == 'kolobok'}).map(elem => {
            return createProductStructure(elem);
        })) 
    }
    console.log(result)

    let fil = result.filter(elem =>{return elem.health == 100 && elem.speed == 246 && elem.st == 3 && elem.kids == 0 && elem.stealth < 1 && elem.cd *1000 > +new Date()})

    let want = fil.map(elem => {return elem.id})
    console.log(fil)
    console.log(want)
}


export const get246kid10 = async ()=> {
    if(!wax.api) {
        alert('Login first!')
        console.log('Login first!')
    }
    const result = []
    let next = ''
    let more = true 
    while(more){
        let data = await wax.rpc.get_table_rows({  
            json: true,
            code:  'simpleassets',
            scope: wax.userAccount,
            table: 'sassets',
            table_key: 'id',
            lower_bound: (next ? next : 0),
            upper_bound: '-1',
            index_position: 1,
            key_type: "i64",
            limit: 1000,
            reverse: false,
            show_payer: false
        })
        let rows = data.rows
        more = data.more
        next = data.next_key
        result.push(...rows.filter(elem =>{return elem.category == 'kolobok'}).map(elem => {
            return createProductStructure(elem);
        })) 
    }
    console.log(result)

    let fil = result.filter(elem =>{return elem.health == 100 && elem.speed == 246 && elem.st == 2 && elem.kids > 10 && elem.stealth < 1 && elem.cd *1000 > +new Date()})

    let want = fil.map(elem => {return elem.id})
    console.log(fil)
    console.log(want)
}


// ----------------------------------------------------------------------------------------------------------------------------------------------------------------------





export const getdie = async ()=> {
    if(!wax.api) {
        alert('Login first!')
        console.log('Login first!')
    }
    let result = []
    let next = ''
    let more = true 
    while(more){
        let data = await wax.rpc.get_table_rows({  
            json: true,
            code:  'simpleassets',
            scope: wax.userAccount,
            table: 'sassets',
            table_key: 'id',
            lower_bound: (next ? next : 0),
            upper_bound: '-1',
            index_position: 1,
            key_type: "i64",
            limit: 1000,
            reverse: false,
            show_payer: false
        })
        let rows = data.rows
        more = data.more
        next = data.next_key
        result.push(...rows.filter(elem =>{return elem.category == 'kolobok'}).map(elem => {
            return createProductStructure(elem);
        })) 
    }

    result = result.filter(elem=>{return elem.health == -1}).map(elem => {return elem.id})
    console.log(result)

    return result
   
}

export const burndie = async (items)=> {
    if(!wax.api) {
        alert('Login first!')
        console.log('Login first!')
    }
    try {
        const result = await wax.api.transact({
        actions: [{
            account: 'simpleassets',
            name: 'burn',
            authorization: [{
                actor: wax.userAccount,
                permission: 'active',
                }],
            data: {
                owner: wax.userAccount,
                assetids: items,
                memo: 'burn Koloboks :(',
            },            
        }]
        }, {
        blocksBehind: 3,
        expireSeconds: 30
        });
        
        let trx_id = result['transaction_id'];
        console.log('Done! Transaction # ' + trx_id)
    } catch(e) {
        console.log(e)
    }
}