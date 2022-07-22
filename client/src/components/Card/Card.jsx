import React, { Fragment, useEffect, useState } from 'react'
import style from './Card.module.css'
import floor from '../../Images/platform.png'
import { Link } from 'react-router-dom';


// const ImgMichaela = (mappedImage) => {
//     debugge
//     const [img,setImg] = useState(mappedImage);

//     useEffect(()=>{
//         const getData =()=> fetch(mappedImage).then(res=>res.blob())
//         .then(imgBlob=>{
//             let src = URL.createObjectURL(imgBlob);
//             setImg(src);
//         }).catch(err=>{
//             setImg("https://i.ibb.co/64yryPM/Pngegg.png");
//         });
//         getData();
//     },[]);

//     return(<img 
//     className={style.img} 
//     src={img} alt='' />);

// }

function Card({ pokesToRender }) {

    // const tryImage = (mappedImage) => {
    //     debugge

    // }

    return (
        <div className={style.div}>
            {
                pokesToRender.map((e) => {

                    return (
                        <Link to={'/detail/' + e.id} style={{ textDecoration: 'none' }}>
                            <div className={style.cardContainer} >
                                <div className={style.imageContainer} >
                                    <img
                                        className={style.img}
                                        src={e.image ? e.image : "https://i.ibb.co/64yryPM/Pngegg.png"} alt='' />
                                    <img className={style.floor} src={floor} alt='' />
                                </div>
                                <div className={style.textContainer} >
                                    <h2 className={style.name}>{e.name}</h2>
                                    <h3 className={style.typesTitle}>Pokémon Types:</h3>
                                    {e.types.map((e) => {
                                        return (
                                            <Fragment>
                                                {typeof e === 'object' ?
                                                    <h3 className={style.types} key={e.id}>{e.name + ','}</h3> :
                                                    <h3 className={style.types} key={e.id}>{e + ','}</h3>
                                                }
                                            </Fragment>
                                        )
                                    })}
                                </div>
                            </div >
                        </Link>
                    )
                })
            }
        </div>
    )
}

export default Card