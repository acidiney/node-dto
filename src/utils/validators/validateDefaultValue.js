'use strict';
module.exports = {
    validateDefaultValue: (objDto,i) => {
        let defValType;
        if(objDto.defaultValue!==null){
            defValType = (objDto.defaultValue instanceof Array)? 'array': typeof objDto.defaultValue;
            if(defValType!==objDto.type.toLowerCase()){
                throw new ValidateException(
                    `Value of the Field defaultValue is not of the same type 
                      as the value given in field type on schema index ${i}!`
                    );
            } 
        }
    }
}