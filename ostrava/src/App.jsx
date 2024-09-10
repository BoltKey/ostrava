import { useCallback, useMemo, useState } from 'react'
import reactLogo from './assets/react.svg'
import board from './assets/board.jpg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const buildingData = {
    "Coal mine": {
      in: {},
      out: {coal: 1},
      rect: {x: 2, w: 47, y: 79, h: 17}
    },
    "Soda factory": {
      in: {coal: 1},
      out: {soda: 2, acid: 1},
      rect: {x: 2, w: 23, y: 52, h: 17}
    },
    "Coke owen": {
      in: {coal: 1},
      out: {coke: 2, tar: 1},
      rect: {x: 27, w: 23, y: 52, h: 17}
    },
    "Soap factory": {
      in: {coal: 1, soda: 1},
      out: {soap: 2},
      rect: {x: 2, w: 23, y: 27, h: 17}
    },
    "Chemical Plant": {
      in: {coal: 1, soda: 1, tar: 1},
      out: {bch: 1, dyes: 2},
      rect: {x: 26, w: 11, y: 27, h: 17}
    },
    "Pharmacal": {
      in: {coal: 1, soda: 1, bch: 1},
      out: {antiseptic: 4},
      rect: {x: 26, w: 11, y: 3, h: 17}
    },
    "Pasture": {
      in: {},
      out: {wool: 1},
      rect: {x: 50, w: 23, y: 79, h: 17}
    },
    "Wool mill": {
      in: {coal: 1, wool: 1, acid: 1},
      out: {yarn: 1},
      rect: {x: 50, w: 23, y: 52, h: 17}
    },
    "Fabric Factory": {
      in: {coal: 1, yarn: 1, dyes: 1},
      out: {wool: 1},
      rect: {x: 50, w: 23, y: 28, h: 17}
    },
    "Garment": {
      in: {coal: 1, fabric: 1},
      out: {cloth: 2},
      rect: {x: 50, w: 23, y: 3, h: 17}
    },
    "Iron ore mine": {
      in: {},
      out: {iore: 1},
      rect: {x: 74, w: 23, y: 79, h: 17}
    },
    "Furnace": {
      in: {coke: 1},
      out: {iore: 1},
      rect: {x: 74, w: 23, y: 52, h: 17}
    },
    "Steel works": {
      in: {coke: 1, iron: 1},
      out: {steel: 1},
      rect: {x: 74, w: 23, y: 28, h: 17}
    },
    "Rolling Mill": {
      in: {coke: 1, steel: 1},
      out: {track: 2},
      rect: {x: 74, w: 23, y: 2, h: 17}
    },
  }
  let startAmts = {}
  for (let k of Object.keys(buildingData)) {
    startAmts[k] = 0;
  }
  let [amts, setAmts] = useState(startAmts)
  const changeBuildingAmt = useCallback((name, amt) => {
    setAmts(amts => {
      let newAmts = Object.assign({}, amts)
      newAmts[name] += amt;
      if (newAmts[name] < 0) {
        newAmts[name] = 0;
      }
      return newAmts
    })
  })
  const resourceAmts = useMemo(() => {
    let result = {}
    for (let name in amts) {
      let data = buildingData[name];
      for (let i in data.in) {
        if (!result[i]) {
          result[i] = 0
        }
        result[i] -= 1 * amts[name]
      }
      for (let o in data.out) {
        if (!result[o]) {
          result[o] = 0
        }
        result[o] += 1 * amts[name]
      }
    }
    for (let r in result) {
      if (result[r] === 0) {
        delete result[r]
      }
    }
    return result
  }, [amts])

  let buildingRects = []
  for (let d in buildingData) {
    let rect = buildingData[d].rect;
    buildingRects.push(<BuildingRect
    rect={rect}
    amt={amts[d]}
    name={d}
    changeBuildingAmt={changeBuildingAmt}
    >

    </BuildingRect>)
  }
  let inResources = [];
  let outResources = []
  for (let r in resourceAmts) {
    let amt = resourceAmts[r]
    let targetResources = amt < 0 ? inResources : outResources
    targetResources.push(<div className='resource-amt'>
      {r}: {amt}
    </div>)
  }
  return (
    <div className='wrap'>
      <div className='image-wrap'>
        <img className='board' src={board}></img>
        {buildingRects}
      </div>
      <div className='io-wrap'>
        <div className='in-res'>
          {inResources}
        </div>
        <div className='out-res'>
          {outResources}
        </div>
      </div>
    </div>
  )
}

function BuildingRect(props) {
  let rect = props.rect;
  return <div className='buildingRect' id={"rect-" + props.name} style={{
    left: rect.x + "%", top: rect.y + "%", width: rect.w + "%", height: rect.h + "%"
  }}>
    <button onClick={() => props.changeBuildingAmt(props.name, -1)}>-</button>
    {props.amt}
    <button onClick={() => props.changeBuildingAmt(props.name, 1)}>+</button>
  </div>
}

export default App
