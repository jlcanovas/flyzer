
# flyzer
Welcome! This is the code for the _flyzer_ tool, a Google Chrome extension to analyze forums. 

## Systems supported
_flyzer_ currently support the analysis of the following forum systems:

* UOC forum systems

We plan to support other forum systems in the futute. Our most immediate step will be to support [Moodle](https://moodle.org). Keep in touch for the last updates

## Current metrics and visualizations

The tool calculates the set of metrics & visualizations for forums described in the following. 

### Collaboration graph

Collaboration graphs facilitate analyzing how a set of nodes works together. In this kind of graphs, nodes represent the actors of a collaborative tasks (e.g., participating in a forum) while edges represent interactions between nodes (e.g., messages in a forum). The different dimensions of nodes and edges (e.g., size or color) can be used to represent metrics of such elements (e.g., number of messages, etc.).

_flyzer_ generates a collaboration graph for forums where nodes represent participants of the forum and edges represent messages between two participants (and the edge points from the participant creating the message towards the participant receiving the message). The bigger a node is, the higher is the number of messages published in the forum by the participant. The thicker an edge is, the higher is the number of messages between the involved participants.

The following image shows an example of collaboration graph:

![Collaboration Graph example](https://github.com/jlcanovas/flyzer/blob/master/examples/exampleGraph.jpg?raw=true?raw=true "Collaboration Graph Example")

# Participating
You can see ideas I plan to work on in the [issues](https://github.com/jlcanovas/flyzer/issues)/[pull requests](https://github.com/jlcanovas/flyzer/pulls) of the project. Also, the [Planning project](https://github.com/jlcanovas/flyzer/projects/3) shows some prospective ideas (e.g., metrics, visualization, etc.).

Any help is more than welcome. Even if you only want to say any comment about some kind of improvement, fell free to create an [issue]([https://github.com/jlcanovas/flyzer/issues](https://github.com/jlcanovas/flyzer/issues)) and I will give you an answer in less than 48 hours. 

If you want to extend the tool (e.g., incorporate new metrics or visualizations) just fork the project and submit a [pull request]([https://github.com/jlcanovas/flyzer/pulls](https://github.com/jlcanovas/flyzer/pulls)). I can assure you that you will make my day if you send me any kind of improvements via this method :)

# License
The tool is currently under [CC-BY-SA]([https://creativecommons.org/licenses/by-sa/4.0/](https://creativecommons.org/licenses/by-sa/4.0/))

![CC-BY-SA](https://i.creativecommons.org/l/by-sa/4.0/88x31.png)
