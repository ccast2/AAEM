function pacientModule (id,name,lastname,typeId,birthdate,sex,eps,address,phone) {

	this.id = id;
	this.name = name;
	this.lastname = lastname;
	this.typeId = typeId;
	this.birthdate = birthdate;
	this.sex = sex;
	this.eps = eps;
	this.address = address;
	this.phone = phone;
}
var tmpPacient = new pacientModule();