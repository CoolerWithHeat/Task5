import './css/TableStyles.css'
import './css/erros_page.scss'
import arrowIcon from './css/crossed_arrow.png'
import Slider from '@mui/material/Slider';
import React from 'react'
import { faker as Faker_Ukraine } from '@faker-js/faker/locale/uk';
import { faker as Faker_USA } from '@faker-js/faker';
import { faker as Faker_Spain } from '@faker-js/faker/locale/es';


const IntroduceErrors = (errorRate, data)=>{
    
    if (errorRate == 0)
        return data

    function introduceRandomErrors(input, maxErrors = 6) {
        const characters = '!@;skmeozxkasdk'.split('');
        const errorCount = Math.min(Math.floor(input.length * errorRate), maxErrors);
        
        for (let i = 0; i < errorCount; i += 1) {
            const randomIndex = Math.floor(Math.random() * input.length);
            const randomCharacter = characters[Math.floor(Math.random() * characters.length)];
            input = input.slice(0, randomIndex) + randomCharacter + input.slice(randomIndex);
        }
        
        return input;
        }
      
    
    const errorData = { ...data };
    if (errorData.id) errorData.id = introduceRandomErrors(errorData.id);
    if (errorData.name) errorData.name = introduceRandomErrors(errorData.name);
    if (errorData.address) errorData.address = introduceRandomErrors(errorData.address);
    if (errorData.phone) errorData.phone = introduceRandomErrors(errorData.phone);
    
    return errorData;
}

export function ErrorsPage(){

    const [sliderValue, Update_sliderValue] = React.useState(1)
    const [lastBatch, Update_lastBatch] = React.useState(0)
    const [Region_Index, Update_Region_Index] = React.useState(0)
    const [seedValue, Update_seedValue] = React.useState(0)
    const [ScrolledTimes, Update_ScrolledTimes] = React.useState(0)
    const [users, Update_users] = React.useState([])

    const regional_index = {
        0: Faker_USA,
        1: Faker_Spain,
        2: Faker_Ukraine,
    }

    const faker = regional_index[parseInt(Region_Index)]  
    faker.seed(parseInt(seedValue))

    function AddMoreUsers(){
        if (ScrolledTimes > 0){ 
            let created_users = [];
            for (let i = parseInt(lastBatch); i < parseInt(lastBatch)+3; i++) {
                const UserInstance = {
                    index: i,
                    id: faker.number.int(),
                    name: faker.person.fullName(),
                    address: faker.address.streetAddress(),
                    phone: faker.phone.number()
                };
                Update_lastBatch(Main=>i)
                created_users.push(IntroduceErrors(Math.round(Math.min(sliderValue, 10)) , UserInstance))
            }
            Update_users(Main=>{
                return [...users, ...created_users]
            })
        }
    }

    function GenerateUsers(){
        let created_users = [];
        for (let i = 0; i < 30; i++) {
            const UserInstance = {
                index: i,
                id: faker.number.int(),
                name: faker.person.fullName(),
                address: faker.address.streetAddress(),
                phone: faker.phone.number()
            };
            Update_lastBatch(Main=>i)
            created_users.push(IntroduceErrors(Math.min(sliderValue, 10), UserInstance))
        }
        
        Update_users(Main=>{
            return created_users
        })
    }
    
    const processedUsers = users.map(Main=>{
        return <UserInstace RowIndex={Main.index} id={Main.id} name={Main.name} address={Main.address} phone={Main.phone}/>
    })

      
      function downloadCSV(){
        if (users && users.length > 0) {
            const csvContent = [
              Object.keys(users[0]).join(','),
              ...users.map((item) => Object.values(item).join(',')),
            ].join('\n');
        
            const blob = new Blob([csvContent], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
        
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', 'exported_data.csv');
            document.body.appendChild(link);
            link.click();
            window.URL.revokeObjectURL(url);
          }
      }
 

    const GenerateSeed = ()=>{
        const randomDigit = Math.floor(Math.random() * 10000000);
        Update_seedValue(Main=>randomDigit)
    }

    const UpdateManualValue = (tagpoint)=>{
        console.log(tagpoint.target.value)
    }

    function HandleChange(data){
        Update_sliderValue(Main=>data.target.value)
    }

    const ChangeSeed = (tagpoint)=>{
        Update_seedValue(Main=>tagpoint.target.value)
    }

    const ChangeSlider = (tagPoint)=>{
        Update_sliderValue(Main=>tagPoint.target.value)
    }

    const UpdateRegion = (tagpoint) => {
        Update_Region_Index(Main=>tagpoint.target.value)
    }
    const handleScroll = (event)=>{
            Update_ScrolledTimes(Main=>window.scrollY/60)
    }

    React.useEffect(Main=>{
        let lastScrollPosition = window.scrollY;
        window.addEventListener("scroll", () => {
            const currentScrollPosition = window.scrollY;
            if (currentScrollPosition > lastScrollPosition) {
                handleScroll('ass')
            }
    
            lastScrollPosition = currentScrollPosition;
          });
    }, [])

    React.useEffect(Main=>{
        AddMoreUsers()
    }, [ScrolledTimes])

    React.useEffect(Main=>{
        GenerateUsers()
    }, [seedValue, Region_Index, sliderValue])

    return (
        <main  id='errorsPage'>
            <br/>
            <br/>
            <br/>
        <section >
     

            <div id='MainBar'>

                <div style={{marginLeft:'50px'}} id='RegionClosure'>
                    <div id='choicesHeader'>
                        <h6 style={{fontSize:'18px', marginTop:'2px'}}>Region: </h6>
                    </div>
                    <div id='choicesField'>
                        <select onChange={UpdateRegion} style={{display:'inline-block'}} class="form-select" id="choicesDropdown">
                            <option value="0">USA</option>
                            <option value="1">Spain</option>
                            <option value="2">Ukraine</option>
                        </select>
                    </div>
                </div>

                <div id='MainSection'>
                
                    <div id='child1'>
                        <h5>Errors:</h5>
                    </div>

                    <div id='child2'>
                        <Slider
                            sx={{ width: 115 }} 
                            aria-label="Temperature"
                            value={Math.min(sliderValue, 10)}
  
                            getAriaValueText={()=>'1°C'}
                            color="secondary"
                            onChange={HandleChange}
                            max={10}
                            />
                    </div>

                    <input value={sliderValue} onChange={ChangeSlider} id='child3'>
                    </input>

                </div>


                <div id='SeedsClosure'>

                    <div id='SeedsClosureChild1'>
                        <h5>Seeds:</h5>
                    </div>
    
                    <input type='text' onChange={ChangeSeed} id='SeedsClosureChild2' style={{fontSize:'17px'}}  value={seedValue ? seedValue : 0}/>
                    
                    <div id='SeedsClosureChild3'>
                        <button onClick={GenerateSeed} style={{marginTop:'-6px', marginLeft:'10px'}} className='btn btn-warning'>
                            <img src={arrowIcon} width={'25px'}/>
                        </button>
                    </div>

                </div>
            <br/>
            <button id='export_button' onClick={downloadCSV} className='btn btn-primary'>Export To CSV</button>
            
            </div>
            <br/>
            <br/>
            <br/>
            <table style={{width:'90%', margin:'auto'}}>
                <thead>
                    <tr>
                        <th>Index</th>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Address</th>
                        <th>Phone</th>
                    </tr>
                </thead>
                <tbody>
                    {processedUsers}
                </tbody>
            </table>
        </section>

    </main>
    )
}

function UserInstace({RowIndex=1, id, name, address, phone}){
    return (
        <tr>
            <td>{RowIndex}</td>
            <td>{id}</td>
            <td>{name}</td>
            <td>{address}</td>
            <td>{phone}</td>
        </tr>
    )
}