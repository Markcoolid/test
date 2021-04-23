/**
 * First-Robotics-Competition form components used for scouting.
 * All functions influence the first sub-tag of the "value" class, later referred to as the value tag.
 * @class Class containing required code for the PWNAGE scouting form.
 * @author: Reed Krantz
 */
class FRCComponents
{
    /**
     * adds to the number in innerHTML of the value tag.
     *
     * @param {element} element the <div> tag element (parent to the value tag).
     * @param {number} step the amount to add to the value tag.
     */
    static counter(element, step)
    {
        var ctr = element.getElementsByClassName("counter")[0];
        var result = parseInt(ctr.value) + step;
    
        if(isNaN(result)) {
            result = 0;
        }

        if(result >= 0 || ctr.hasAttribute('data-negative')) {
            ctr.value = result;
        } else {
            ctr.value = 0;
        }
    }

    /**
     * creates a timer and calculates time past.
     *
     * @param {element} element the parent <div> tag element.
     * @param {number} status updates the status of the counter (whether or not its recording the time and direction).
     * -1: timer start counting down
     *  0: timer stop
     *  1: timer start counting up
     * undefined: don't change status
     * @param {number} seconds the amount in seconds to add to the total time. 0 for reset and undefined for do not change.
     */
    static timer(element, status, seconds)
    {
        var value = element.getElementsByClassName("value")[0];

        const TIMERDECIMAL = 1;

        if(status === undefined) {
            if(value.hasAttribute('data-status')) {
                status = parseInt(value.getAttribute('data-status'));
            } else {
                status = 0;
            }
        }

        if(value.hasAttribute('data-timestamp') && (value.getAttribute('data-timestamp') < Date.now()) !== (value.getAttribute('data-status') > 0)) {
            seconds = 0.0;
            status = 0;
        }

        if(status != 0) {
            setTimeout(FRCComponents.timer, 100, element);
        }

        if(seconds !== 0.0) {
            let newSeconds = 0.0;

            if(value.hasAttribute('data-timestamp')) {
                newSeconds += Math.abs((Date.now() - value.getAttribute('data-timestamp'))/1000);
            } else if(!isNaN(parseFloat(value.innerHTML))) {
                newSeconds += parseFloat(value.innerHTML);
            }

            if(seconds !== undefined) {
                newSeconds += seconds;
                if(newSeconds < 0) {
                    newSeconds = 0;
                }
            } else if(status == value.getAttribute('data-status')) {
                value.innerHTML = newSeconds.toFixed(TIMERDECIMAL);
                return;
            }
            seconds = newSeconds;
        }

        value.setAttribute('data-status', status);

        value.innerHTML = seconds.toFixed(TIMERDECIMAL);
        if(status === 0) {
            value.removeAttribute('data-timestamp');
        } else {
            value.setAttribute('data-timestamp', Date.now() - (seconds * status * 1000));
        }
    }
}
