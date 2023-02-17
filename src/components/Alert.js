import Swal from "sweetalert2";

export function winGame() {
    Swal.fire({
        icon:'success',
        allowOutsideClick:false,
        title:'YOU WIN!!!',
        text:'You can catch a cat.',
    }).then(()=>{
        location.reload()
    })
}

export function loseGame(){
    Swal.fire({
        icon:'error',
        allowOutsideClick:false,
        title:'YOU LOSE!!!',
        text:'You let the cat escape.',
    }).then(()=>{
        location.reload()
    })
}