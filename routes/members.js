// geet list members
exports.list = function(req, res){

  req.getConnection(function(err,connection){
       
        var query = connection.query('SELECT * FROM members Where member_is_deleted = 0',function(err,rows){
            
            if(err){
                console.log("Error Selecting : %s ",err );
            }
     
            // render trang customers , noi dung dua ra : page_title va data.
            res.render('members',{page_title:"Members - Node.js",data:rows});
                
            // console.log(rows); 
           
         });
         
    });
  
};

exports.view_add_edit = function (req, res){
    var id = req.params.id;
    var saveSuccess = req.query.save;
    // console.log(req.query); 
    if (id) { // truong hop edit

        req.getConnection(function(err, connection){
            var query = connection.query('Select * from members where id = '+ id, function (err, rows){
                if (err){
                    console.log('Err geting data member : %s', err);
                }
                res.render('view_add_edit',{page_title: "Edit member - Node.js", data: rows, saveSuccess: saveSuccess});
            });
        });
    } else { // truong hop add

        res.render('view_add_edit', {page_title:'Add member - Node.js', data:''});
    }
};

exports.save = function (req, res){
    var id = req.params.id;
    // current date time
    var dateTime = require('node-datetime');
    var dt = dateTime.create();
    dt = dt.format('Y-m-d H:M:S');

    var md5 = require('md5');
    
    if (id) { // edit
        // get all params by post method
        var paramsPost = JSON.parse(JSON.stringify(req.body));

        var dataUpdate = {};
        var err = '';
        var new_passworld = paramsPost.member_new_passworld;
        var renew_passworld = paramsPost.member_renew_passworld;


        if (new_passworld == '' && renew_passworld == '' ) {
            // bo qua viec tao data update passworld
        } else if (new_passworld !='' && renew_passworld =='') {
            // loi doi pass world
            err += 'err changing new passworld'; 
        } else if (new_passworld == '' && renew_passworld != '') {
            // loi doi pass world
            err += 'err changing new passworld';
        } else if (new_passworld != '' && renew_passworld != '' && new_passworld != renew_passworld) {
            err += "err changing new passworld";
        } else {
            // tao data passworld
            dataUpdate['member_login_passworld'] = md5(new_passworld);
        }

        if (err == '') {
            // login name
            var login_name = paramsPost.member_login_name;
            if (login_name)
                dataUpdate['member_login_name'] = login_name;
            // display name
            var display_name = paramsPost.member_name;
            if (display_name)
                dataUpdate['member_name'] = display_name;
            // member mail
            var member_mail = paramsPost.member_mail;
            if (member_mail)
                dataUpdate['member_mail'] = member_mail;
            
            dataUpdate['member_updated_datetime'] = dt;
            
            // update data
            req.getConnection(function (err, connection){
                var query = connection.query('update members set ? Where id = ?',[dataUpdate, id], function (err, rows){
                    if (err){
                        console.log("err updating member data : %s", query.sql);
                    }
                    // res.render('view_add_edit', {page_title:'View Member - Node.js', data:rows});
                    res.redirect('/members/edit/'+id+'?save=1');
                });
            });

        } else {
            console.log("err updating member data : %s", err);
            res.redirect('/members');
        }

    } else { // add new
        // get all params by post method
        var paramsPost = JSON.parse(JSON.stringify(req.body));

        var dataInsert = {};
        var err = '';
        var new_passworld = paramsPost.member_new_passworld;
        var renew_passworld = paramsPost.member_renew_passworld;


        if (new_passworld == '' && renew_passworld == '' ) {
            // bo qua viec tao data update passworld
        } else if (new_passworld !='' && renew_passworld =='') {
            // loi doi pass world
            err += 'err creating passworld'; 
        } else if (new_passworld == '' && renew_passworld != '') {
            // loi doi pass world
            err += 'err creating passworld';
        } else if (new_passworld != '' && renew_passworld != '' && new_passworld != renew_passworld) {
            err += "err changing new passworld";
        } else {
            // tao data passworld
            dataInsert['member_login_passworld'] = md5(new_passworld);
        }

        if (err == '') {
            // login name
            var login_name = paramsPost.member_login_name;
            if (login_name)
                dataInsert['member_login_name'] = login_name;
            // display name
            var display_name = paramsPost.member_name;
            if (display_name)
                dataInsert['member_name'] = display_name;
            // member mail
            var member_mail = paramsPost.member_mail;
            if (member_mail)
                dataInsert['member_mail'] = member_mail;
            
            dataInsert['member_created_datetime'] = dt;

            req.getConnection(function (err, connection){
                var query = connection.query('Insert into members set ?',[dataInsert], function (err, rows){
                    if (err) {
                        console.log('err inserting data member : %s', err);
                    }

                    res.redirect('/members');
                });
            });
            
        } else {
            console.log('err : %s', err);
            res.redirect('/members');
        }
    }
};

// delete member by id
exports.delete = function (req, res){
    var id =req.params.id;
    var dateTime = require('node-datetime');
    var dt = dateTime.create();
    dt = dt.format('Y-m-d H:M:S');
    var dataUpdate = {
        // member_updater_id : '',
        member_updated_datetime : dt,
        member_is_deleted : 1
    };

    req.getConnection(function (err, connection){
        var query = connection.query('update members set ? Where id = ?',[dataUpdate,id], function (err, rows){
            if(err){
                console.log("error deleting member : %s", err);
            }

            res.redirect('/members');
        });
    });
};