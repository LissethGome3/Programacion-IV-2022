var db_sistema = openDatabase('dbsistema', '1.0', 'Sistema de Facturacion', 5 * 1024 * 1024);
if(!db_sistema){
    alert('Lo siento tu navegado NO soporta BD locales.');
}
var app = new Vue({
    el: '#appCliente',
    data: {
        clientes: [],
        buscar: '',
        cliente: {
            accion: 'nuevo',
            msg : '',
            idCliente: '',
            codigo: '',
            nombre: '',
            direccion: '',
            telefono: '',
            dui: ''
        },
    },
    methods: {
        guardarCliente(){
            let sql = '',
                parametros = [];
            if(this.cliente.accion == 'nuevo'){
                sql = 'INSERT INTO clientes (codigo, nombre, direccion, telefono, dui) VALUES (?,?,?,?,?)';
                parametros = [this.cliente.codigo,this.cliente.nombre,this.cliente.direccion,this.cliente.telefono,this.cliente.dui]; 
            }else if(this.cliente.accion == 'modificar'){
                sql = 'UPDATE clientes SET codigo=?, nombre=?, direccion=?, telefono=?, dui=? WHERE idCliente=?';
                parametros = [this.cliente.codigo,this.cliente.nombre,this.cliente.direccion,this.cliente.telefono,this.cliente.dui,this.cliente.idCliente];
            }
            console.log(sql, parametros, this.cliente);
            db_sistema.transaction(tx=>{
                tx.executeSql(sql,
                    parametros,
                (tx, results)=>{
                    this.cliente.msg = 'Cliente guardado con exito';
                    this.nuevoCliente();
                    this.obtenerClientes();
                },
                (tx, error)=>{
                    this.cliente.msg = `Error al guardar el cliente ${error.message}`;
                });
            });
        },
        modificarCliente(cliente){
            this.cliente = cliente;
            this.cliente.accion = 'modificar';
        },
        obtenerClientes(){
            db_sistema.transaction(tx=>{
                tx.executeSql('SELECT * FROM clientes', [], (tx, results)=>{
                    this.clientes = results.rows;
                });
            });
        },
        nuevoCliente(){
            this.cliente.accion = 'nuevo';
            this.cliente.idCliente = '';
            this.cliente.codigo = '';
            this.cliente.nombre = '';
            this.cliente.direccion = '';
            this.cliente.telefono = '';
            this.cliente.dui = '';
        }
    },
    created(){
        db_sistema.transaction(tx=>{
            tx.executeSql('CREATE TABLE IF NOT EXISTS clientes(idCliente INTEGER PRIMARY KEY AUTOINCREMENT, '+
                'codigo char(10), nombre char(75), direccion TEXT, telefono char(10), dui char(10))');
        }, err=>{
            console.log('Error al crear la tabla de clientes', err);
        });
        this.obtenerClientes();
    }
});