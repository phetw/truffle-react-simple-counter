pragma solidity ^0.4.2;

contract Counter {
    uint counter = 0;

    function increment() public returns (uint){
        return counter++;
    }

    function decrement() public {
        counter--;
    }

    function getCoutner() public view returns (uint){
        return counter;
    }
}
